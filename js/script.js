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

        function handleLogin(event) {
            event.preventDefault();
            const email = event.target.email.value;
            const senha = event.target.senha.value;
          
        if (email === "admin@admin.com" && senha === "admin") {
             showNotification("Login bem-sucedido!",'sucesso');
            } else {
              showNotification("Email ou senha incorretos.");
            }
          }
          
          function handleCadastro(event) {
            event.preventDefault();
            showNotification("Cadastro simulado com sucesso!", 'sucesso');
          }
          
          function handleRecuperar(event) {
            event.preventDefault();
            const email = event.target.email.value;
           showNotification(`Se existisse um backend, um link de recuperação seria enviado para: ${email}`, 'sucesso');
          }