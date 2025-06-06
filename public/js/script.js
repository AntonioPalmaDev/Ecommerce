// Alternar entre login e cadastro
document.addEventListener("DOMContentLoaded", function () {
  showLogin();
});

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});



// Virar o cartão (para recuperação de senha)
function flipCard() {
  document.getElementById('flip-card').classList.toggle('flipped');
}

// Enviar dados de cadastro
async function handleCadastro(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.name.value;
  const email = form.email.value;
  const password = form.password.value;
  const type = form.type.value || 'Cliente' || 'ADMIN'; 

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, type }),
    });

    const data = await response.json();

    if (response.ok) {
      showNotification('Cadastro realizado com sucesso!', 'sucesso');
      form.reset();
      container.classList.remove('right-panel-active'); // volta para login
    } else {
      showNotification(data.message || 'Erro no cadastro.', 'erro');
    }
  } catch (error) {
    console.error(error);
    showNotification('Erro ao conectar com o servidor.', 'erro');
  }
}

// Enviar dados de login
async function handleLogin(event) {
  event.preventDefault();

  const form = event.target;
  const email = form.email.value;
  const password = form.senha.value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showNotification(`Bem-vindo, ${data.user.name}!`, 'sucesso');
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1500);
    } else {
      showNotification(data.message || 'Erro no login.', 'erro');
    }
  } catch (error) {
    console.error(error);
    showNotification('Erro ao conectar com o servidor.', 'erro');
  }
}

// Simula recuperação de senha
function handleRecuperar(event) {
  event.preventDefault();
  const email = event.target.email.value;
  showNotification(`Se existisse um backend, um link de recuperação seria enviado para: ${email}`, 'sucesso');
}
function showLogin() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("cadastro-form").style.display = "none";
  document.getElementById("recuperar-form").style.display = "none";
}

function showCadastro() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("cadastro-form").style.display = "block";
  document.getElementById("recuperar-form").style.display = "none";
}

function showRecuperar() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("cadastro-form").style.display = "none";
  document.getElementById("recuperar-form").style.display = "block";
}
