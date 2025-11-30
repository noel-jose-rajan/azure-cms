import { z } from "zod";

const colorSchema = z.object({
  backgroundText: z.string().min(1, "Background text color is required"),
  background: z.string().min(1, "Background color is required"),
  backgroundSecondary: z
    .string()
    .min(1, "Background secondary color is required"),
  surface: z.string().min(1, "Surface color is required"),
  surfaceHover: z.string().min(1, "Surface hover color is required"),
  surfaceActive: z.string().min(1, "Surface active color is required"),
  text: z.string().min(1, "Text color is required"),
  textSecondary: z.string().min(1, "Text secondary color is required"),
  textMuted: z.string().min(1, "Text muted color is required"),
  primary: z.string().min(1, "Primary color is required"),
  primaryDark: z.string().min(1, "Primary dark color is required"),
  primaryLight: z.string().min(1, "Primary light color is required"),
  secondary: z.string().min(1, "Secondary color is required"),
  accent: z.string().min(1, "Accent color is required"),
  border: z.string().min(1, "Border color is required"),
  shadow: z.string().min(1, "Shadow color is required"),
  success: z.string().min(1, "Success color is required"),
  warning: z.string().min(1, "Warning color is required"),
  danger: z.string().min(1, "Danger color is required"),
  info: z.string().min(1, "Info color is required"),
  disabled: z.string().min(1, "Disabled color is required"),
  link: z.string().min(1, "Link color is required"),
  linkHover: z.string().min(1, "Link hover color is required"),
  overlayColor: z.string().min(1, "Overlay color is required"),
  overlayTransparency: z.number().positive("Transparency must be positive"),
  headerBackground: z.string().min(1, "Header background color is required"),
  headerText: z.string().min(1, "Header text color is required"),
  footerBackground: z.string().min(1, "Footer background color is required"),
  footerText: z.string().min(1, "Footer text color is required"),
});

const lineHeightSchema = z.object({
  tight: z.number().positive("Tight line height must be positive"),
  normal: z.number().positive("Normal line height must be positive"),
  relaxed: z.number().positive("Relaxed line height must be positive"),
});

const headingSchema = z.object({
  fontSize: z.string().min(1, "Font size is required"),
  fontWeight: z.number().positive("Font weight must be positive"),
  lineHeight: z.string().min(1, "Line height is required"),
});

const headingsSchema = z.object({
  h1: headingSchema,
  h2: headingSchema,
  h3: headingSchema,
  h4: headingSchema,
  h5: headingSchema,
  h6: headingSchema,
  body: headingSchema,
});

const typographySchema = z.object({
  fontFamily: z.string().min(1, "Font family is required"),
  fontSize: z.number().positive("Font size must be positive"),
  fontWeightLight: z.number().positive("Font weight light must be positive"),
  fontWeightRegular: z
    .number()
    .positive("Font weight regular must be positive"),
  fontWeightBold: z.number().positive("Font weight bold must be positive"),
  lineHeight: lineHeightSchema,
  headings: headingsSchema,
});

const spacingSchema = z.object({
  none: z.string().min(1, "Spacing for none is required"),
  xs: z.string().min(1, "Spacing for xs is required"),
  sm: z.string().min(1, "Spacing for sm is required"),
  md: z.string().min(1, "Spacing for md is required"),
  lg: z.string().min(1, "Spacing for lg is required"),
  xl: z.string().min(1, "Spacing for xl is required"),
  xxl: z.string().min(1, "Spacing for xxl is required"),
  xxxl: z.string().min(1, "Spacing for xxxl is required"),
});

const borderRadiusSchema = z.object({
  none: z.string().min(1, "None border radius is required"),
  small: z.string().min(1, "Small border radius is required"),
  medium: z.string().min(1, "Medium border radius is required"),
  large: z.string().min(1, "Large border radius is required"),
  xl: z.string().min(1, "XL border radius is required"),
  full: z.string().min(1, "Full border radius is required"),
});

const animationDurationSchema = z.object({
  fast: z.string().min(1, "Fast duration is required"),
  normal: z.string().min(1, "Normal duration is required"),
  slow: z.string().min(1, "Slow duration is required"),
});

const animationEasingSchema = z.object({
  ease: z.string().min(1, "Ease easing is required"),
  easeIn: z.string().min(1, "Ease-in easing is required"),
  easeOut: z.string().min(1, "Ease-out easing is required"),
  easeInOut: z.string().min(1, "Ease-in-out easing is required"),
});

const animationSchema = z.object({
  fadeIn: z.string().min(1, "Fade-in animation is required"),
  fadeOut: z.string().min(1, "Fade-out animation is required"),
  slideIn: z.string().min(1, "Slide-in animation is required"),
  slideOut: z.string().min(1, "Slide-out animation is required"),
  scaleIn: z.string().min(1, "Scale-in animation is required"),
  scaleOut: z.string().min(1, "Scale-out animation is required"),
  duration: animationDurationSchema,
  easing: animationEasingSchema,
});

const shadowSchema = z.object({
  none: z.string().min(1, "None shadow is required"),
  small: z.string().min(1, "Small shadow is required"),
  medium: z.string().min(1, "Medium shadow is required"),
  large: z.string().min(1, "Large shadow is required"),
  xl: z.string().min(1, "XL shadow is required"),
  inner: z.string().min(1, "Inner shadow is required"),
});

const breakpointsSchema = z.object({
  xs: z.string().min(1, "XS breakpoint is required"),
  sm: z.string().min(1, "SM breakpoint is required"),
  md: z.string().min(1, "MD breakpoint is required"),
  lg: z.string().min(1, "LG breakpoint is required"),
  xl: z.string().min(1, "XL breakpoint is required"),
  xxl: z.string().min(1, "XXL breakpoint is required"),
});

const zIndexSchema = z.object({
  dropdown: z.number().int("Dropdown z-index must be an integer"),
  sticky: z.number().int("Sticky z-index must be an integer"),
  fixed: z.number().int("Fixed z-index must be an integer"),
  modal: z.number().int("Modal z-index must be an integer"),
  popover: z.number().int("Popover z-index must be an integer"),
  tooltip: z.number().int("Tooltip z-index must be an integer"),
  toast: z.number().int("Toast z-index must be an integer"),
});

const accessibilitySchema = z.object({
  highContrastMode: z.boolean(),
  reducedMotion: z.boolean(),
  focusRing: z.string().min(1, "Focus ring is required"),
  focusRingOffset: z.string().min(1, "Focus ring offset is required"),
});

const layoutHeaderSchema = z.object({
  height: z.string().min(1, "Header height is required"),
  background: z.string().min(1, "Header background is required"),
  textColor: z.string().min(1, "Header text color is required"),
  alignment: z.string().min(1, "Header alignment is required"),
});

const layoutFooterSchema = z.object({
  background: z.string().min(1, "Footer background is required"),
  textColor: z.string().min(1, "Footer text color is required"),
  alignment: z.string().min(1, "Footer alignment is required"),
});

const layoutSidebarSchema = z.object({
  width: z.string().min(1, "Sidebar width is required"),
  background: z.string().min(1, "Sidebar background is required"),
  textColor: z.string().min(1, "Sidebar text color is required"),
});

const layoutGridSchema = z.object({
  columns: z.number().int().positive("Grid columns must be a positive integer"),
  gap: z.string().min(1, "Grid gap is required"),
  maxWidth: z.string().min(1, "Grid max width is required"),
});

const layoutSchema = z.object({
  header: layoutHeaderSchema,
  footer: layoutFooterSchema,
  sidebar: layoutSidebarSchema,
  grid: layoutGridSchema,
});

const buttonVariantSchema = z.object({
  background: z.string().min(1, "Button background is required"),
  textColor: z.string().min(1, "Button text color is required"),
  border: z.string().min(1, "Button border is required"),
  borderRadius: z.string().min(1, "Button border radius is required"),
  padding: z.string().min(1, "Button padding is required"),
});

const buttonSchema = z.object({
  primary: buttonVariantSchema,
  secondary: buttonVariantSchema,
  disabled: buttonVariantSchema,
});

const inputSchema = z.object({
  background: z.string().min(1, "Input background is required"),
  textColor: z.string().min(1, "Input text color is required"),
  border: z.string().min(1, "Input border is required"),
  borderRadius: z.string().min(1, "Input border radius is required"),
  padding: z.string().min(1, "Input padding is required"),
  focusBorder: z.string().min(1, "Input focus border is required"),
  placeholderColor: z.string().min(1, "Input placeholder color is required"),
});

const cardSchema = z.object({
  background: z.string().min(1, "Card background is required"),
  border: z.string().min(1, "Card border is required"),
  borderRadius: z.string().min(1, "Card border radius is required"),
  padding: z.string().min(1, "Card padding is required"),
  shadow: z.string().min(1, "Card shadow is required"),
});

const componentsSchema = z.object({
  button: buttonSchema,
  input: inputSchema,
  card: cardSchema,
});

export const themeSchema = z.object({
  name: z.string().min(1, "Theme name is required"),
  colors: colorSchema,
  typography: typographySchema,
  spacing: spacingSchema,
  borderRadius: borderRadiusSchema,
  animations: animationSchema,
  shadows: shadowSchema,
  breakpoints: breakpointsSchema,
  zIndex: zIndexSchema,
  accessibility: accessibilitySchema,
  layout: layoutSchema,
  components: componentsSchema,
});
