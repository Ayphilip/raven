const avatars = [
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds1.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds2.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds3.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds4.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds5.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds6.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds7.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds8.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds9.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds10.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds11.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds12.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds13.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds14.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds15.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds16.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds17.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds18.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds19.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds20.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds21.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds22.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds23.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds24.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds25.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds26.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds27.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds28.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds29.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds30.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds31.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds32.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds33.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds34.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds35.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds36.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds37.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds38.png',
    'https://raw.githubusercontent.com/Ayphilip/appPics/main/background/profiles/adds39.png'
]

const view = [
    'Everyone',
    'Friends',
    'Only me'
]

const highlightMentions = (text) => {
    return text.replace(/@(\w+)/g, `<span class="mention">@$1</span>`);
};


export { avatars, view, highlightMentions };