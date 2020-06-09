// 預設匯入時名字可以不一樣

// import apple from './export.js'
// console.log(apple)

// let number = apple.add(1,2)
// console.log(number);

// 具名匯入
// 匯入時名稱必須一樣
// import {} 放要引用的變數
// 如果怕變數名稱跟檔案內的重複，可ˇ使用 as

// import {a} from './export.js'
import * as test from './export.js'
// console.log(a);
// console.log(b);
// console.log(c);
console.log(test);

// 預設和具名同時匯入
// import 預設，具名 from 檔案
import apple,{a} from './export.js'
console.log(apple,a);