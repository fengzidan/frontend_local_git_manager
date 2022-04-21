import { genId, getImg } from "../utils/tool";
import defaultImg from "@/assets/images/default.png";

/**
 * @class 用户信息
 * @param id 唯一标志，随机生成
 * @param name 用户名，游客用户名添加唯一标志
 * @param portrait 用户头像，游客用户统一头像
 * @param isLogin 是否登录
 * @description 存储用户信息，1. 游客用户；2. 登录用户
 * @author zhangzedan
 * @date 2022-03-01
 */
export default class User {
  id = "";
  name = "";
  portrait = defaultImg;
  isLogin = false;

  constructor({ id, name }: { id?: string; name?: string }) {
    this.id = id || genId(6, "user");
    this.name = name || `${this.id}`;
  }

  /**
   * @function 登录后,修改User数据
   * @param data 登录后的User数据
   * @description 登录后，修改User数据
   * @author zhangzedan
   * @date 2022-03-02
   */
  login({
    id,
    name,
    portrait,
  }: {
    id: string;
    name: string;
    portrait: string;
  }) {
    this.id = id;
    this.name = name;
    this.setPortrait(portrait);
    this.isLogin = true;
  }

  /**
   * @function 设置头像
   * @param src 头像地址
   * @description 验证地址有效性并设置
   * @author zhangzedan
   * @date 2022-03-02
   */
  setPortrait(src = "") {
    const img = getImg(src);
    if (img) {
      this.portrait = img;
    } else {
      console.warn("无效的头像地址");
    }
    return this;
  }
}
