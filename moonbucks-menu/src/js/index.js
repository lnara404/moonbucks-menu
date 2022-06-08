// step1 요구사항 구현을 위한 전략
// TODO 메뉴 추가
// - [O] 메뉴의 이름을 입력 받고 엔터키 입력으로 추가된다.
// - [O] 메뉴의 이름을 입력 받고 확인 버튼을 클릭하면 메뉴를 추가된다.
// - [O] 추가되는 메뉴의 마크업은 ‘<ul id=”menu-list” class=”mt-3 pl-0”></ul>’ 안에 삽입해야 한다.
// - [O] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [O] 메뉴가 추가되고 나면, input은 빈 값으로 초기화된다.
// - [O] 사용자 입력값이 빈 값이라면 추가되지 않는다.

const $ = (selector) => document.querySelector(selector);

function App() {
  // form 태그가 자동으로 전송되는걸 막음
  $('#menu-form').addEventListener('submit', (e) => {
    e.preventDefault();
  });

  const addMenuName = () => {
    if ($('#menu-name').value === ''){
      alert('값을 입력해주세요.');
      return;
    }
    const menuName = $('#menu-name').value;
    const menuItemTemplate = (menuName) => {
      return `
        <li class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name">${menuName}</span>
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
    }
    $('#menu-list').insertAdjacentHTML('beforeend', menuItemTemplate(menuName));

    const menuCount = $('#menu-list').querySelectorAll('li').length;
    $('.menu-count').innerText = `총 ${menuCount} 개`;
    $('#menu-name').value = '';
  }

  // 메뉴의 이름을 입력 받고 확인 버튼을 클릭
  $('#menu-submit-button').addEventListener('click', (e) => {
    addMenuName();
  });

  // 메뉴의 이름을 입력 받고 엔터키 입력
  $('#menu-name').addEventListener('keypress', (e) => {
    if(e.key !== 'Enter') {
      return;
    }
    addMenuName();
  });
}
App();