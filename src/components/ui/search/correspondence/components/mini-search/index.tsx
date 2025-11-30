import React, { useEffect, useState, useRef } from 'react';
import { TextField, InputAdornment, IconButton, List, ListItem } from "@mui/material";
import { SearchOutlined } from '@ant-design/icons'; // Import Search Icon from Ant Design
import { arabicLabels } from '../../../../../../constants/app-constants/ar';
import { englishLabels } from '../../../../../../constants/app-constants/en';
import { useLanguage } from '../../../../../../context/language';
import { CorrespondenceType } from '../../../../../../types/correspondence';
import { CorrespondenceSearchQuery } from '../../types';
import { search as corrSearch } from "../../service"



interface Props {
    onAdvanceSearch?: () => any;
    onSelect?: (corres: CorrespondenceType) => any;
    values?: CorrespondenceType | CorrespondenceType[]
    label?: string
}

const MiniSearch: React.FC<Props> = ({ onAdvanceSearch, onSelect, values, label }) => {
    // context
    const { isEnglish } = useLanguage();

    // states
    const [search, setSearch] = useState('');
    const [list, setList] = useState<CorrespondenceType[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const [query] = useState<CorrespondenceSearchQuery>({
        correspondenceTypeCode: "all",
        criteriaValue: search,
        page: 0,
        receivingEntityType: 0,
        sendingEntityType: 0,
        size: 10,
        sort: "correspondenceDate,desc"
    })

    const [criteria] = useState({
        "singleCriteria": {
            "finalApproverOrgUnitId": -1,
            "correspondenceNo": "",
            "subject": "",
            "createdByMe": false,
            "isDeleted": false,
            "contentSearch": false,
            "externalReferenceNo": "",
            "barcode": "",
            "inboundSenderName": "",
            "correspondenceDateFrom": "",
            "correspondenceDateTo": "",
            "recieveDateFrom": "",
            "recieveDateTo": "",
            "createdDateFrom": "",
            "createdDateTo": "",
            "signDateFrom": "",
            "signDateTo": "",
            "sentDateFrom": "",
            "sentDateTo": ""
        },
        "multiCriteria": {
            "statusPicklistIDs": [],
            "securityPicklistIDs": [],
            "urgencyPicklistIDs": [],
            "documentTypePicklistIDs": [],
            "keywords": [],
            "recievingEntityIDs": [],
            "sendingEntityIDs": [],
            "relatedCorrespondenceIDs": []
        }
    })

    // computed
    const { lbl } = isEnglish ? englishLabels : arabicLabels;

    const handleSearch = () => {
        onAdvanceSearch && onAdvanceSearch();
    };

    const handleSelect = (corres: CorrespondenceType) => {
        onSelect && onSelect(corres);
        setIsFocused(false); // Close the list on selection
    };

    useEffect(() => {

        corrSearch({ query, ...criteria }).then(d => d && setList(d?.content))



        return () => { };
    }, [search]);

    // Close the list when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filterArray = (filterValue: CorrespondenceType | CorrespondenceType[] | undefined, data: CorrespondenceType[]) => {

        const ids = Array.isArray(filterValue) ? filterValue.map(m => m.corrId) : [filterValue?.corrId]

        return data.filter(f => !ids.includes(f.corrId))
    }

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <TextField
                margin='normal'
                required
                color='success'
                placeholder={label ?? lbl.correspondence}
                label={label ?? lbl.correspondence}
                variant="standard"
                type='search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                style={{ width: "100%" }}

                InputProps={{
                    ...(isEnglish ? {
                        endAdornment:
                            <InputAdornment position={"end"}>
                                <IconButton onClick={handleSearch}>
                                    <SearchOutlined style={{ fontSize: '24px' }} />
                                </IconButton>
                            </InputAdornment>
                    }
                        :
                        {
                            startAdornment:
                                <InputAdornment position={"start"}>
                                    <IconButton onClick={handleSearch}>
                                        <SearchOutlined style={{ fontSize: '24px' }} />
                                    </IconButton>
                                </InputAdornment>
                        }
                    )
                }}
                sx={{
                    '& .MuiInputLabel-asterisk': {
                        color: 'red',
                    },



                }}
            />
            {isFocused && list.length > 0 && (
                <List style={{
                    position: 'absolute',
                    width: '100%',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    zIndex: 1000
                }}>
                    {filterArray(values, list).map((corres) => (
                        // @ts-ignore
                        <ListItem key={corres.organizationUnitId!} onClick={() => handleSelect(corres)} button>
                            <span style={{ padding: 0, margin: 0, width: "100%" }}>
                                <>{corres.subject} <br />
                                    <small>{corres.correspondenceNo}</small>
                                </>
                                <hr />
                            </span>

                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );
};

export default MiniSearch;
