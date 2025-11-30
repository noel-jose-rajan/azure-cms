import { ThemeType } from "../../types/theme";

// Import Themes Here
import LightTheme from "./themes/light"
import DarkTheme from "./themes/dark"
import SoloridTheme from "./themes/solorid";
import DraculaTheme from "./themes/dracula"
import LegacyTheme from "./themes/legacy";

export type ThemeName = 'light' | 'dark' | 'solorid' | 'dracula' | 'legacy'


type ThemeSystem = Record<ThemeName, ThemeType>


const themes: ThemeSystem = {
    'light': LightTheme,
    "dark": DarkTheme,
    "solorid": SoloridTheme,
    "dracula": DraculaTheme,
    "legacy": LegacyTheme

}


export default themes