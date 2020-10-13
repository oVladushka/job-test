const $form = document.querySelector('form');
const $name = document.getElementById('name');
const $email = document.getElementById('email');
const $password = document.getElementById('password');

$form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try{
        const user = await axios.post('/api/signup', {name: $name.value, email: $email.value, password: $password.value});
        console.log(user.data);
    }catch(e){
        console.log(e.response ? e.response.data.error : e.message);
    }

});