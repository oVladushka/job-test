const $form = document.querySelector('form');
const $email = document.getElementById('email');
const $password = document.getElementById('password');

$form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try{
        const user = await axios.post('/api/signin', {email: $email.value, password: $password.value});
        console.log(user.data);
    }catch(e){
        console.log(e.response ? e.response.data.error : e.message);
    }

});