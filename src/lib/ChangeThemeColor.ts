const ChangeThemeColor = (color: string) => {
  const meta = document.querySelector("meta[name='theme-color']");
  if (meta) {
    meta.setAttribute('content', color);
  }
}


// make shure the theme color is set for every page
export default ChangeThemeColor;