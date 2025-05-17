const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
        });

        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
        });

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
                }, 400); // espera a transição acabar
            }, 5000);
        }
        

        function flipCard() {
            document.getElementById('flip-card').classList.toggle('flipped');
        }

        async function handleLogin(event) {
  event.preventDefault();

  const email = event.target.email.value;
  const senha = event.target.senha.value;

  try {
    const res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();

    if (!res.ok) {
      showNotification(data.message || 'Erro no login.', 'erro');
      return;
    }

    // Armazenar token e dados do usuário
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    showNotification('Login realizado com sucesso!', 'sucesso');

    // Redirecionar para a loja
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 1500);
  } catch (error) {
    console.error(error);
    showNotification('Erro ao conectar com o servidor.', 'erro');
  }
}

          
          async function handleCadastro(event) {
  event.preventDefault();

  const nome = event.target.nome_usuario.value;
  const email = event.target.email_usuario.value;
  const telefone = event.target.telefone_usuario.value;
  const tipo = event.target.tipo_usuario.value;
  const senha = event.target.senha.value;

  try {
    const res = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone, tipo, senha }),
    });

    const data = await res.json();

    if (!res.ok) {
      showNotification(data.message || 'Erro ao cadastrar.', 'erro');
      return;
    }

    showNotification('Cadastro realizado com sucesso!', 'sucesso');

    // Alternar para o painel de login
    container.classList.remove('right-panel-active');
  } catch (error) {
    console.error(error);
    showNotification('Erro ao conectar com o servidor.', 'erro');
  }
}

          
          function handleRecuperar(event) {
            event.preventDefault();
            const email = event.target.email.value;
           showNotification(`Se existisse um backend, um link de recuperação seria enviado para: ${email}`, 'sucesso');
          }