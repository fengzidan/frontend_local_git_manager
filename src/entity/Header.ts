import { getImg } from "../utils/tool";
import IconCtrl from "./IconCtrl";
import User from "./User";

/**
 * @class 页头信息
 * @param title 必选，项目名
 * @param logo 可选，logo图片
 * @param sysControl 可选，系统控制项，子项为IconCtrl数据类型
 * @description 页头中展示用的信息，
 * @author zhangzedan
 * @date 2022-03-01
 */
export default class Header {
  // 必须项
  title = "ToB管理项目";

  // 其他项
  logo = "";
  user?: User;
  sysControl: IconCtrl[] = [];

  // 显示配置
  showCtrl = false;
  showUser = false;

  constructor({
    title,
    logo,
    sysControl = [],
    user,
  }: {
    title: string;
    logo?: string;
    sysControl?: IconCtrl[];
    user?: User;
  }) {
    if (!this.title) {
      console.warn("将使用默认项目名称");
    }
    this.title = title;
    if (logo) {
      this.setLogo(logo);
    }
    if (user) {
      this.setUser(user);
    }
    if (sysControl) {
      this.setSysCtrl(sysControl);
    }
  }

  /**
   * @function 配置页头的logo图像
   * @param logo 图像地址
   * @description 验证图像有效性并设置
   * @author zhangzedan
   * @date 2022-03-02
   */
  setLogo(logo = "") {
    const img = getImg(logo);
    if (img) {
      this.logo = img;
    } else {
      console.warn("无效的图像地址");
    }
    return this;
  }

  /**
   * @function 配置系统控制列表
   * @param sysControl 系统控制项列表
   * @description 配置系统控制列表
   * @author zhangzedan
   * @date 2022-03-02
   */
  setSysCtrl(sysControl: any[] = []) {
    this.sysControl = sysControl.map((item: any) =>
      item instanceof IconCtrl ? item : new IconCtrl(item)
    );
    this.showCtrl = true;
    return this;
  }

  /**
   * @function 配置页头里的用户信息
   * @param userData 用户信息数据
   * @description 配置页头里的用户信息
   * @author zhangzedan
   * @date 2022-03-02
   */
  setUser(userData?: User) {
    if (userData && userData.isLogin && this.user) {
      this.user.login(userData);
    } else {
      if (userData) {
        this.user = new User(userData);
      } else {
        this.user = new User({});
      }
    }
    this.showUser = true;
    return this;
  }
}
