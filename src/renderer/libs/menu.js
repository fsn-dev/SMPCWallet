import { remote } from 'electron'
console.log(remote)

const Menu = remote.Menu
const MenuItem = remote.MenuItem
function initMenu(){

  const menu = new Menu();
  const menu2 = new Menu();
  menu.append(new MenuItem({label:'撤销', role: 'undo' }));
  menu.append(new MenuItem({label:'重做', role: 'redo' }));
  // menu.append(new MenuItem({ role: 'separator' }));
  menu.append(new MenuItem({label:'剪切', role: 'cut' }));
  menu.append(new MenuItem({label:'复制', role: 'copy' }));
  menu.append(new MenuItem({label:'粘贴', role: 'paste' }));
  // menu.append(new MenuItem({ role: 'pasteandmatchstyle' }));
  menu.append(new MenuItem({label:'删除', role: 'delete' }));
  menu.append(new MenuItem({ label:'全选', role: 'selectall' }));

  menu2.append(new MenuItem({label:'复制', role: 'copy' }));
  //点击dome
  menu2.append(new MenuItem({label:'show', click() { 
    //展示选中文本
    let selectText = window.getSelection().toString();
    alert(selectText); 
  } }));
  window.addEventListener('contextmenu', (e) => { 
  
    e.preventDefault();
    if(isEleEditable(e.target)){
      menu.popup(remote.getCurrentWindow());
    }else{
      //判断有文本选中
      let selectText = window.getSelection().toString();
      if(!!selectText){
          menu2.popup(remote.getCurrentWindow());
      }
    }
  }, false) 
}
function isEleEditable(e){
  // return true
  if(!e){
    return false;
  }
  //为input标签或者contenteditable属性为true
  if(e.tagName == 'INPUT' || e.contentEditable == 'true'){
    return true;
  }else{
    //递归查询父节点
    return isEleEditable(e.parentNode)
  }
}
initMenu()
export const test = 1