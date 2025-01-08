export class CookieService {
    public setCookie(
        name: string,
        value: any,
        days: number = 31,
        path: string = "/"
    ): void {
        const jsonData = JSON.stringify(value); // Serialize the data
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${jsonData}; expires=${date.toUTCString()}; path=${path}`;
    }

    public getCookie<T>(name: string): T | null {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            try {
                return JSON.parse(parts.pop()!.split(";").shift()!);
            } catch (error) {
                console.error("Error parsing cookie data:", error);
                return null;
            }
        }
        return null;
    }

    public deleteCookie(name: string, path: string = "/"): void {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
    }

    public hasCookie(name: string): boolean {
        return document.cookie.split(";").some((item) => item.trim().startsWith(`${name}=`));
    }
}
