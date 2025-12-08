/**
 * 圣诞倒数日历 - 简化版（依赖 Shopify/Omnisend 表单自身提交）
 * 只负责前端门逻辑 + 奖品弹窗
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.getElementById('adventCalendar');
    if (!calendar) return;

    // 配置
    const config = window.adventCalendarConfig || {};
    const STORAGE_KEY = 'advent_calendar_2025';
    const EMAIL_KEY = 'advent_email_2025';
    const PENDING_KEY = 'advent_pending_prize';

    // 当前选中的门
    let currentDoor = null;

    // DOM 元素
    const elements = {
      emailModal: document.getElementById('emailModal'),
      prizeModal: document.getElementById('prizeModal'),
      emailForm: document.getElementById('adventEmailForm'),
      toastContainer: document.getElementById('toastContainer')
    };

    // =============================
    // 初始化
    // =============================
    function init() {
      bindEvents();
      restoreClaimedDoors();
      highlightToday();
      prefillEmail();
      showPendingPrizeAfterReload();
    }

    // 刷新回来后检查是否有待弹出的奖品
    function showPendingPrizeAfterReload() {
      let raw = null;
      try {
        raw = localStorage.getItem(PENDING_KEY);
      } catch (e) {}

      if (!raw) return;

      // 只用一次就清掉，避免重复弹
      try {
        localStorage.removeItem(PENDING_KEY);
      } catch (e) {}

      let data;
      try {
        data = JSON.parse(raw);
      } catch (err) {
        console.error('parse advent_pending_prize error:', err);
        return;
      }

      if (!data || !data.day) return;

      // 可选：超过30分钟就不再弹，防止旧数据干扰
      if (data.timestamp && Date.now() - data.timestamp > 30 * 60 * 1000) {
        return;
      }

      // 找到对应的门 DOM 元素
      const doorEl = document.getElementById('door-' + data.day);
      if (!doorEl) {
        console.warn('Door element not found for day:', data.day);
        return;
      }

      // 更新 currentDoor，让 showPrizeModal 能拿到正确信息
      currentDoor = {
        element: doorEl,
        day: data.day,
        prizeType: data.prizeType,
        prizeValue: data.prizeValue,
        prizeCode: data.prizeCode,
        isSpecial: data.isSpecial
      };

      // 标记为已领取
      markDayClaimed(data.day, data.email || '');

      // 打开门 & 弹奖品
      openDoor(doorEl);
      showPrizeModal();

      showToast('🎉 领取成功！', 'success');

      // 自动滚动到日历模块
      const cal = document.getElementById('adventCalendar');
      if (cal) {
        cal.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // =============================
    // 事件绑定
    // =============================
    function bindEvents() {
      // 门点击
      document.querySelectorAll('.calendar-door').forEach(function(door) {
        door.addEventListener('click', handleDoorClick);
      });

      // 表单提交前，只做：邮箱校验 + 记录 pending 奖品，不再自己 fetch
      if (elements.emailForm) {
        elements.emailForm.addEventListener('submit', handleAdventFormSubmitBeforeReload);
      }

      // 弹窗关闭
      document.querySelectorAll('[data-close-modal]').forEach(function(el) {
        el.addEventListener('click', closeAllModals);
      });

      // ESC 关闭
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAllModals();
      });

      // 复制按钮
      const copyBtn = document.getElementById('copyCodeBtn');
      if (copyBtn) {
        copyBtn.addEventListener('click', copyDiscountCode);
      }
    }

    // 表单提交前：校验邮箱 + 把奖品信息存到 localStorage，交给表单自己提交
    function handleAdventFormSubmitBeforeReload(e) {
      const emailInput = document.getElementById('customerEmail');
      const email = emailInput ? emailInput.value.trim() : '';

      // 基本邮箱验证：不合法就阻止提交
      if (!isValidEmail(email)) {
        e.preventDefault();
        showToast('❌ 请输入有效的邮箱地址', 'error');
        if (emailInput) {
          emailInput.classList.add('error');
          emailInput.focus();
        }
        return;
      }

      if (!currentDoor) {
        // 理论上不会发生
        return;
      }

      // 从 currentDoor 里取奖品信息
      const prizeData = {
        email: email,
        day: currentDoor.day,
        prizeType: currentDoor.prizeType,
        prizeValue: currentDoor.prizeValue,
        prizeCode: currentDoor.prizeCode,
        isSpecial: currentDoor.isSpecial,
        timestamp: Date.now()
      };

      try {
        localStorage.setItem(PENDING_KEY, JSON.stringify(prizeData));
        localStorage.setItem(EMAIL_KEY, email);
      } catch (err) {
        console.warn('localStorage set error:', err);
      }

      // 注意：这里 不要 e.preventDefault()
      // 让表单按自己的 action/method 正常提交（Shopify/Omnisend 处理 & 跳转/刷新）
      // 刷新回来后 showPendingPrizeAfterReload() 会自动开奖
    }

    // =============================
    // 门点击处理
    // =============================
    function handleDoorClick(e) {
      const door = e.currentTarget;
      const day = parseInt(door.dataset.day, 10);
      const status = door.dataset.status;

      // 检查是否锁定
      if (status === 'locked') {
        showToast('🔒 还没到开启时间哦！', 'warning');
        shakeDoor(door);
        return;
      }

      // 检查是否已领取
      if (isDayClaimed(day)) {
        showToast('✅ 您已经领取过了！', 'info');
        return;
      }

      // 保存当前门信息
      currentDoor = {
        element: door,
        day: day,
        prizeType: door.dataset.prizeType,
        prizeValue: door.dataset.prizeValue,
        prizeCode: door.dataset.prizeCode,
        isSpecial: door.dataset.special === 'true'
      };

      showEmailModal();
    }

    function shakeDoor(door) {
      door.classList.add('shake');
      setTimeout(function() {
        door.classList.remove('shake');
      }, 500);
    }

    // =============================
    // 邮箱弹窗
    // =============================
    function showEmailModal() {
      if (!currentDoor) return;

      // 更新弹窗内容
      document.getElementById('modalDay').textContent = currentDoor.day;
      document.getElementById('formDay').value = currentDoor.day;
      document.getElementById('formPrizeType').value = currentDoor.prizeType;
      document.getElementById('formPrizeValue').value = currentDoor.prizeValue;
      document.getElementById('formPrizeCode').value = currentDoor.prizeCode;

      // 更新提示
      const subtitle = document.getElementById('modalSubtitle');
      if (subtitle) {
        subtitle.textContent = currentDoor.isSpecial 
          ? '⭐ 大奖日！输入邮箱领取专属大奖' 
          : '输入邮箱，领取您的专属奖励';
      }

      // 显示弹窗
      elements.emailModal.classList.add('active');
      
      setTimeout(function() {
        const emailInput = document.getElementById('customerEmail');
        if (emailInput) emailInput.focus();
      }, 100);
    }

    function prefillEmail() {
      let savedEmail = null;
      try {
        savedEmail = localStorage.getItem(EMAIL_KEY);
      } catch (e) {}
      const customerEmail = config.customerEmail;
      const emailInput = document.getElementById('customerEmail');
      
      if (emailInput && (savedEmail || customerEmail)) {
        emailInput.value = savedEmail || customerEmail;
      }
    }

    // =============================
    // 奖品弹窗
    // =============================
    function showPrizeModal() {
      if (!currentDoor) return;

      const icons = {
        discount: '🏷️',
        gift_card: '💳',
        free_product: '🎁',
        cable_tray: '🔌',
        cable_tube: '🐍',
        desk_board: '🖥️'
      };

      document.getElementById('prizeDayDisplay').textContent = currentDoor.day;
      document.getElementById('prizeIconLarge').textContent = icons[currentDoor.prizeType] || '🎁';
      document.getElementById('prizeValueDisplay').textContent = currentDoor.prizeValue;

      const codeSection = document.getElementById('codeSection');
      const bigPrizeNotice = document.getElementById('bigPrizeNotice');
      
      const showCode = currentDoor.prizeCode && 
        ['discount', 'cable_tray', 'cable_tube', 'free_product'].indexOf(currentDoor.prizeType) !== -1;

      if (showCode) {
        codeSection.style.display = 'block';
        document.getElementById('discountCodeDisplay').textContent = currentDoor.prizeCode;
        bigPrizeNotice.style.display = 'none';
      } else {
        codeSection.style.display = 'none';
        bigPrizeNotice.style.display = 'block';
      }

      elements.prizeModal.classList.add('active');
      createConfetti();
    }

    function openDoor(doorElement) {
      doorElement.classList.add('opened', 'claimed');
    }

    function createConfetti() {
      const container = document.getElementById('confettiContainer');
      if (!container) return;

      container.innerHTML = '';
      const colors = ['#ff6b6b', '#4ecdc4', '#ffd93d', '#6bcb77', '#ff85a1'];

      for (let i = 0; i < 40; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
        container.appendChild(confetti);
      }

      setTimeout(function() {
        container.innerHTML = '';
      }, 4000);
    }

    // =============================
    // 复制折扣码
    // =============================
    function copyDiscountCode() {
      const code = document.getElementById('discountCodeDisplay').textContent;
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(function() {
          showToast('✅ 折扣码已复制！', 'success');
          updateCopyButton(true);
        });
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('✅ 折扣码已复制！', 'success');
        updateCopyButton(true);
      }
    }

    function updateCopyButton(copied) {
      const btn = document.getElementById('copyCodeBtn');
      if (!btn) return;
      
      const originalText = btn.textContent;
      btn.textContent = '已复制 ✓';
      
      setTimeout(function() {
        btn.textContent = originalText;
      }, 2000);
    }

    // =============================
    // 状态管理
    // =============================
    function getClaimedData() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      } catch (e) {
        return {};
      }
    }

    function isDayClaimed(day) {
      const data = getClaimedData();
      return !!data[day];
    }

    function markDayClaimed(day, email) {
      const data = getClaimedData();
      data[day] = {
        email: email,
        claimedAt: new Date().toISOString(),
        prize: currentDoor ? currentDoor.prizeValue : null
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {}
    }

    function restoreClaimedDoors() {
      const data = getClaimedData();
      Object.keys(data).forEach(function(day) {
        const door = document.getElementById('door-' + day);
        if (door) {
          door.classList.add('claimed', 'opened');
        }
      });
    }

    function highlightToday() {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth();

      // 12月 8-25日
      if (month === 11 && day >= 8 && day <= 25) {
        const todayDoor = document.getElementById('door-' + day);
        if (todayDoor && !isDayClaimed(day)) {
          todayDoor.classList.add('today');
        }
      }
    }

    // =============================
    // 弹窗控制
    // =============================
    function closeModal(modal) {
      if (modal) {
        modal.classList.remove('active');
      }
    }

    function closeAllModals() {
      closeModal(elements.emailModal);
      closeModal(elements.prizeModal);
    }

    // =============================
    // 工具函数
    // =============================
    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showToast(message, type) {
      type = type || 'info';
      let container = elements.toastContainer;
      if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
        elements.toastContainer = container;
      }

      const toast = document.createElement('div');
      toast.className = 'toast ' + type;
      toast.textContent = message;

      container.appendChild(toast);

      setTimeout(function() {
        toast.classList.add('hide');
        setTimeout(function() {
          toast.remove();
        }, 300);
      }, 3000);
    }

    // 启动
    init();
  });
})();