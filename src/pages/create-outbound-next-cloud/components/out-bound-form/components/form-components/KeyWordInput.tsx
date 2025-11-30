import React, { useState } from 'react';
import { TextField, Box, Chip, IconButton, Tooltip } from '@mui/material';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Correspondence } from '../../../../types';
import { useLanguage } from '../../../../../../context/language';

interface Props {
    values: Correspondence;
    handleValuesChange: (value: any) => any
}

const KeywordInput: React.FC<Props> = ({ values, handleValuesChange }) => {

    const { labels } = useLanguage()
    const [input, setInput] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value); // Update the input as user types
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            event.key === 'Enter'
            && input.trim()
            && !values.correspondenceDTO?.documentKeyword?.includes(input.trim())) {

            console.log(values.correspondenceDTO?.documentKeyword ?? []);


            // handleValuesChange([
            //     ...(values.correspondenceDTO?.documentKeyword ?? []),
            //     input.trim()

            // ])
            setInput(''); // Clear input field after adding keyword
        }
    };

    const handleDeleteKeyword = (keywordToDelete: string) => {
        const newKeywords = (values.correspondenceDTO?.documentKeyword ?? []).filter((keyword) => keyword !== keywordToDelete)

        handleValuesChange(newKeywords)

    };

    return (
        <>
            {JSON.stringify(values.correspondenceDTO?.documentKeyword)}
            <Box sx={{ position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>

                <TextField
                    margin='normal'
                    label={labels.lbl.keywords}
                    variant="standard"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown} // Add Enter key handler
                    fullWidth
                    multiline
                    minRows={1}
                    maxRows={3} // You can adjust the number of rows based on your design

                />
                <Tooltip title={labels.msg.hint_keywords} arrow>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                        }}
                    >
                        <InfoCircleOutlined />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, marginTop: "0.4rem" }}>
                {values.correspondenceDTO?.documentKeyword?.map((keyword, index) => (
                    <Chip
                        key={index}
                        label={keyword}
                        onDelete={() => handleDeleteKeyword(keyword)}
                        size="small"
                    />
                ))}
            </Box></>

    );
};

export default KeywordInput;
