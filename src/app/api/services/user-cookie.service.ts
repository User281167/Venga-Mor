import { USER_COOKIES } from "../constants/user-cookies";
import { CookieService } from "./cookie.service";

export const UserCookieService = {
  setName(name: string) {
    return CookieService.set(USER_COOKIES.NAME, name, {
      maxAge: 60 * 60, // 1 hora
    });
  },

  getName() {
    return CookieService.get(USER_COOKIES.NAME);
  },

  deleteName() {
    return CookieService.delete(USER_COOKIES.NAME);
  },

  setPhoto(photoUrl: string) {
    return CookieService.set(USER_COOKIES.PHOTO, photoUrl, {
      maxAge: 60 * 60,
    });
  },

  getPhoto() {
    return CookieService.get(USER_COOKIES.PHOTO);
  },

  clear() {
    return CookieService.deleteMany([USER_COOKIES.NAME, USER_COOKIES.PHOTO]);
  },
};
