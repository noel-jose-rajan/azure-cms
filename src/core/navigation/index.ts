import { NavigationList, NavigationStructure } from "../../types/navigation";

export default class Navigation {


    private flattenNavigation = (
        navObject: NavigationStructure,
        parentPath: string = ''
    ): NavigationList[] => {
        const result: NavigationList[] = [];

        for (const [key, value] of Object.entries(navObject)) {
            const fullPath = `${parentPath}${value.path}`;
            result.push({
                name: key,
                path: fullPath,
                component: value.component,
            });

            if (value.children) {
                const childPaths = this.flattenNavigation(value.children, fullPath);
                result.push(...childPaths);
            }
        }

        return result;
    };

    public getNavigationList(
        navigationStructure: NavigationStructure,
    ) {
        return this.flattenNavigation(navigationStructure)
    }




}