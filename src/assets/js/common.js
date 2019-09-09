/**
 * Created by zifeng.ou on 2017/12/27.
 */
import axios from 'axios';
import { Toast, MessageBox } from 'mint-ui';
export default {
  BASE_URL: '/api',
  BASE_FILE_URL: '/file',
  PREFIX_STORAGE: 'gjzx_wap_',
  /*
  *  异步请求
  *  `url` 是用于请求的服务器 URL
  *  `method` 是创建请求时使用的方法 默认是 get
  *  `headers` 是即将被发送的自定义请求头
  *  `params` GET   是即将与请求一起发送的 URL 参数 必须是一个无格式对象(plain object)或 URLSearchParams 对象
  *  `data`   POST  是作为请求主体被发送的数据
  *  `timeout` 指定请求超时的毫秒数(0 表示无超时时间),如果请求话费了超过 `timeout` 的时间，请求将被中断
  *  `uploadProgress` 允许为上传处理进度事件
  *  `downloadProgress` 允许为下载处理进度事件
  *  `isUpload` 是否上传文件
  * */
  ajax (params) {
    // 公共参数
    let userInfo = this.getUserInfo() || false;
    if (userInfo && params.isCommonParams) {
      if (params.method === 'post') {
        params.data = params.data || {};
        params.data.ticket = userInfo.ticket;
        params.data.equipmentType = 3;
        if (userInfo.studentInfo) {
          params.data.userAccount = userInfo.studentInfo.userAccount;
        }
      } else if (params.method === 'get') {
        params.params = params.params || {};
        params.params.ticket = userInfo.ticket;
        params.params.equipmentType = 3;
        if (userInfo.studentInfo) {
          params.params.userAccount = userInfo.studentInfo.userAccount;
        }
      }
    }
    // 公共参数结束
    axios({
      url: params.url,
      method: params.method || 'get',
      headers: params.headers || {},
      params: params.params || undefined,
      timeout: params.timeout || 20000,
      // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
      // 在没有设置 `transformRequest` 时，必须是以下类型之一：
      // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
      // - 浏览器专属：FormData, File, Blob
      // - Node 专属： Stream
      data: params.data,

      // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
      // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
      auth: params.auth || undefined,

      onUploadProgress: function (progressEvent) {
        // 对原生进度事件的处理
        if (params.uploadProgress) {
          params.uploadProgress(progressEvent);
        }
      },

      onDownloadProgress: function (progressEvent) {
        // 对原生进度事件的处理
        if (params.downProgress) {
          params.downProgress(progressEvent);
        }
      },
      // `transformRequest` 允许在向服务器发送前，修改请求数据
      // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
      // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
      transformRequest: [function (obj) {
        let data;
        if (typeof obj === 'object') {
          if (typeof FormData === 'function' && params.isUpload) {
            data = new FormData();
            for (let attr in obj) {
              data.append(attr, obj[attr]);
            }
          } else {
            let arr = [];
            let i = 0;
            for (let attr in obj) {
              arr[i] = encodeURIComponent(attr) + '=' + encodeURIComponent(obj[attr]);
              i++;
            }
            data = arr.join('&');
          }
        } else {
          data = obj;
        }
        return data;
      }],
      // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
      baseURL: this.BASE_URL,

      // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
      responseType: params.responseType || 'json' // 默认的json

    }).then((response) => {
      if (params.successCak) {
        params.successCak(response.data);
      }
    }).catch((error) => {
      if (params.errorCak) {
        params.errorCak(error);
      }
    });
  },
  /*
   *  弹框
   *  `msg` 显示文本 默认 空
   *  `position` 显示位置 默认bottom
   *  `duration` 显示时间 默认 2000
   *
   * */
  toast (msg = '', position = 'bottom', duration = 2000) {
    Toast({
      message: msg,
      position: position,
      duration: duration
    });
  },
  // 弹出去下载APP的提示
  showToDown () {
    let self = this;
    MessageBox({
      message: '如需进行下一步体验，请前往下载App。',
      cancelButtonText: '取消',
      confirmButtonText: '前往',
      showCancelButton: true
    }).then((active) => {
      if (active === 'confirm') {
        window.location.href = self.BASE_URL + '/app_download_new.html';
      }
    });
  },
  // 设置本地缓存
  setStorage (key, val) {
    if (!key || !val) {
      return false;
    }
    key = this.PREFIX_STORAGE + key;
    if (typeof val === 'object') {
      val = JSON.stringify(val);
    }
    window.localStorage.setItem(key, val);
  },
  // 获取本地缓存
  getStorage (key) {
    if (!key) {
      return false;
    }
    key = this.PREFIX_STORAGE + key;
    let val = window.localStorage.getItem(key);
    try {
      val = JSON.parse(val);
    } catch (e) {
    }
    return val;
  },
  // 清除本地缓存
  removeStorage () {
    window.localStorage.removeItem(this.PREFIX_STORAGE + 'userinfo');
  },
  // 获取用户信息
  getUserInfo () {
    return this.getStorage('userinfo');
  },
  // 删除缓存
  rmStorage (key) {
    if (!key) {
      window.localStorage.clear();
    } else {
      key = this.PREFIX_STORAGE + key;
      window.localStorage.removeItem(key);
    }
  },
  // 保存用户信息
  setUserInfo (val) {
    this.setStorage('userinfo', val);
  },
  // 删除用户信息
  removeUserInfo (val) {
    this.rmStorage('userinfo');
  }
}
;
