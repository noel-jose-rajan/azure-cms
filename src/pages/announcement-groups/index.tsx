import TitleBar from "../../components/ui/bar/title-bar";
import { useLanguage } from "../../context/language";
import AnnouncementGroupsTable from "./components/result-table";

export default function AnnouncementGroups() {

    //contexts
    const { labels } = useLanguage()


    return (
        <>
            <TitleBar headerText={labels.mnu.announcements_groups} />
            <AnnouncementGroupsTable />
        </>
    )
}
