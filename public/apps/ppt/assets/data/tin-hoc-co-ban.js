import {fileExplorerLesson} from './lessons/file-explorer.js';
import {layoutGallery} from './lessons/layout-gallery.js';
export const courses={
 'tin-hoc-co-ban':{
  id:'tin-hoc-co-ban',name:'Tin học cơ bản',
  description:'Bài giảng nền tảng về Windows, Word và Excel; dùng chung cho nhiều lớp. Trọng tâm thực hành Word và Excel.',
  lessons:{'buoi-01-file-explorer':fileExplorerLesson,'layout-gallery':layoutGallery}
 }
};
