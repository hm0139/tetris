/**
 * ランダムな整数を得る
 * @param {Number} max 最大値
 * @param {Number} min 最小値
 * @returns 得られた疑似乱数
 */
export function randomInt(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 配列の中身をシャッフル
 * @param {Number[]} array シャッフルする配列
 * @returns シャッフルされた配列
 */
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomInt(i + 1, 0);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * ピクセル座礁を行と列に変換
 * @param {HTMLElement} element 対象のHTML要素
 * @param {Number} pixleX X座標
 * @param {Number} pixleY Y座標
 * @param {Number} originX 原点となるX座標
 * @param {Number} originY 原点となるY座標
 * @param {Number} boxSize 行列の一つのマスの大きさ
 * @returns {{col: Number, row: Number}} 得られたマスの位置
 */
export function convertColAndRowPosition(element, pixleX, pixleY, originX, originY, boxSize) {
  const elementPos = element.getBoundingClientRect();
  const positionX = pixleX - elementPos.left - originX;
  const positionY = pixleY - elementPos.top - originY;
  const col = Math.floor(positionX / boxSize);
  const row = Math.floor(positionY / boxSize);
  return { col: col, row: row };
}

/**
 * オブジェクトのプロパティを再帰的に凍結
 * @param {Object} object 凍結するオブジェクト
 * @returns 凍結されたオブジェクト
 */
export function deepFreeze(object) {
  // オブジェクトで定義されたプロパティ名を取得
  const propNames = Reflect.ownKeys(object);

  // 自分自身を凍結する前にプロパティを凍結
  for (const name of propNames) {
    const value = object[name];

    if ((value && typeof value === "object") || typeof value === "function") {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
}

/**
 * 日付の加算(減算も可)
 * @param {Date} date 加算する日付
 * @param {Number} addYear 加算する年
 * @param {Number} addMonth 加算する月
 * @param {Number} addDay 加算する日
 * @returns 加算された日付
 */
export function addDate(date, addYear, addMonth, addDay) {
  const copyDate = new Date(date.getTime());
  copyDate.setFullYear(copyDate.getFullYear() + addYear);
  copyDate.setMonth(copyDate.getMonth() + addMonth);
  copyDate.setDate(copyDate.getDate() + addDay);
  return copyDate;
}

/**
 * 秒を時分秒の形式に変換する
 * @param {Number} time 変換する時刻(秒)
 * @returns {{h: Number, m: Number, s: Number}} 変換結果
 */
export function convertTimeHMS(time) {
  const s = time % 60;
  const m = Math.floor(time / 60) % 60;
  const h = Math.floor(time / 3600);

  return { h: h, m: m, s: s };
}

/**
 * ゼロ埋め
 * @param {Number} num ゼロ埋めする数値
 * @param {Number} digit 桁数
 * @returns {String} ゼロ埋めした文字列
 */
export function padZero(num, digit) {
  return (new Array(digit).join("0") + num).slice(-digit);
}

/**
 * @typedef {Object} DisabledForm
 * @property {HTMLElement} formElement 対象となる入力フォーム
 * @property {Boolean} disabled 無効にするかどうか
 * @property {String} className トグルするHTMLクラス
 */
/**
 * 入力フォームの有効/無効の切り替え
 * @param {DisabledForm[]} formDisabledInfos
 */
export function switchFormDisabled(formDisabledInfos) {
  for (const formInfo of formDisabledInfos) {
    const { formElement, disabled, className } = formInfo;
    if (disabled) {
      formElement.disabled = true;
      if (className != undefined && className != "") {
        formElement.classList.remove(className);
      }
    } else {
      formElement.disabled = false;
      if (className != undefined && className != "") {
        formElement.classList.add(className);
      }
    }
  }
}

/**
 * イージング関数(out cubic)
 * @param {Number} from 初期値
 * @param {Number} to 最終値
 * @param {Number} x fromからto間の変化の割合(0 ~ 1)
 * @returns {Number} 結果
 */
export function easeOutCubic(from, to, x) {
  const n = 1 - Math.pow(1 - x, 3);
  return from * (1 - n) + to * n;
}
