  function showNotification(message, type) {
    const notification = document.getElementById('notificacao');
    notification.textContent = message;
    notification.style.backgroundColor = type === 'sucesso' ? '#4CAF50' : '#f44336';
    notification.classList.add('show');
    notification.classList.remove('hidden');

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.classList.add('hidden');
      }, 400);
    }, 5000);
  }