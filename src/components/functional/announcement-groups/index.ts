import {
  AnnouncementGroupsType,
  SearchGroupsType,
} from "@/components/services/announcement-groups/type";

export const searchAnnouncementGroups = (
  data: AnnouncementGroupsType[],
  searchType: SearchGroupsType,
  isEnglish: boolean
) => {
  return data.filter((group) => {
    const matchesNameEn = searchType.name_en
      ? (isEnglish ? group.name_en : group.name_ar)
          .toLowerCase()
          .includes(searchType.name_en.toLowerCase())
      : true;
    const matchesEntityCode = searchType.entity_code
      ? group.entity_code
          .toLowerCase()
          .includes(searchType.entity_code.toLowerCase())
      : true;
    const matchesEmail = searchType.email
      ? group.email.toLowerCase().includes(searchType.email.toLowerCase())
      : true;

    const matchActivate =
      searchType.is_active !== undefined ? searchType.is_active === true : true;

    return matchesNameEn && matchesEntityCode && matchesEmail && matchActivate;
  });
};
