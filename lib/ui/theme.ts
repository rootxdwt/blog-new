export interface themeType {
    main: {
        borderColor: string;
        headColor: string;
        titleColor: string;
        tagColor: string;
        mainColor: string;
        mainTextColor: string;
        codeBackgroundColor: string;
        codeFontColor: string;
    };
    header: {
        borderColor: string;
        ButtonColor: string;
        logoColor: string;
    }

}
export const dark: themeType = {
    main: {
        borderColor: "rgb(46, 46, 46)",
        headColor: "rgb(220, 220, 220)",
        titleColor: "rgb(255,255,255)",
        tagColor: "rgb(30, 30, 30)",
        mainColor: "#000",
        mainTextColor: "rgb(139, 139, 139)",
        codeBackgroundColor: "rgba(255,255,255,0.11)",
        codeFontColor: "#fff"
    },
    header: {
        borderColor: "#484848",
        ButtonColor: "rgb(72, 72, 72)",
        logoColor: "rgb(200, 200, 200)"
    }
}

export const light: themeType = {
    main: {
        borderColor: "rgb(188, 188, 188)",
        headColor: "rgb(55, 55, 55)",
        titleColor: "rgb(0, 0, 0)",
        tagColor: "rgb(235, 235, 235)",
        mainColor: "#fff",
        mainTextColor: "rgb(89, 89, 89)",
        codeBackgroundColor: "rgba(0,0,0,.07)",
        codeFontColor: "#000",
    },
    header: {
        borderColor: "#b3b3b3",
        ButtonColor: "rgb(191, 191, 191)",
        logoColor: "rgb(102, 102, 102)"
    }
}
