export function randomInt(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomInt(i + 1, 0);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function convertColAndRowPosition(element, pixleX, pixleY, originX, originY, boxSize) {
  const elementPos = element.getBoundingClientRect();
  const positionX = pixleX - elementPos.left - originX;
  const positionY = pixleY - elementPos.top - originY;
  const col = Math.floor(positionX / boxSize);
  const row = Math.floor(positionY / boxSize);
  return { col: col, row: row };
}

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

export function addDate(date, addYear, addMonth, addDay) {
  const copyDate = new Date(date.getTime());
  copyDate.setFullYear(copyDate.getFullYear() + addYear);
  copyDate.setMonth(copyDate.getMonth() + addMonth);
  copyDate.setDate(copyDate.getDate() + addDay);
  return copyDate;
}

export function convertTimeHMS(time) {
  const s = time % 60;
  const m = Math.floor(time / 60) % 60;
  const h = Math.floor(time / 3600);

  return { h: h, m: m, s: s };
}

export function padZero(num, digit) {
  return (new Array(digit).join("0") + num).slice(-digit);
}

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

export function easeOutCubic(begin, end, x) {
  const n = 1 - Math.pow(1 - x, 3);
  return begin * (1 - n) + end * n;
}
