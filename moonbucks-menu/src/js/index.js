import { $ } from './utils/dom.js';
import { store } from './store/index.js';
import MenuApi from './api/index.js';

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = 'espresso';
  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    initEventListeners();
  };

  const render = async () => {
    // 전체 메뉴 리스트 불러오기
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    const template = this.menu[this.currentCategory].map((menuItem) => {
      return `
        <li data-menu-id="${menuItem.id}" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name ${menuItem.isSoldOut ? 'sold-out' : ''}">${menuItem.name}</span>
          <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
          >
          품절
          </button>
          <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
          >
          수정
          </button>
          <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
          >
          삭제
          </button>
        </li>`;
    }).join('');

    $('#menu-list').innerHTML = template;
    updateMenuCount();
  }

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $('.menu-count').innerText = `총 ${menuCount} 개`;
  };

  const addMenuName = async () => {
    if ($('#menu-name').value === ''){
      alert('값을 입력해주세요.');
      return;
    }
    const menuName = $('#menu-name').value;
    await MenuApi.createMenu(this.currentCategory, menuName); //메뉴 추가
    render();
    $('#menu-name').value = '';
  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt('메뉴명을 수정하세요.', $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    render();
  };

  const removeMenuName = async (e) => {
    if (confirm('정말 삭제하시겠습니다?')) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deletMenu(this.currentCategory, menuId);
      render();
    };
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains('cafe-category-name')
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  }

  const initEventListeners = () => {
    $('#menu-list').addEventListener('click', (e) => {
      if (e.target.classList.contains('menu-edit-button')) {
        updateMenuName(e);
        return; //if문이 여러개 있는 경우, 조건이 충족하여 다음 조건문 실행이 필요 없는 경우에 추가하면 불필요한 연산이 줄어듬
      }
  
      if (e.target.classList.contains('menu-remove-button')) {
        removeMenuName(e);
        return;
      }
  
      if (e.target.classList.contains('menu-sold-out-button')) {
        soldOutMenu(e);
        return;
      }
    });
  
    $('#menu-form').addEventListener('submit', (e) => {
      e.preventDefault();
    });
  
    $('#menu-submit-button').addEventListener('click', addMenuName);
  
    $('#menu-name').addEventListener('keypress', (e) => {
      if(e.key !== 'Enter') {
        return;
      }
      addMenuName();
    });
  
    $('nav').addEventListener('click', changeCategory);
  
  };
}

const app = new App();
app.init();
