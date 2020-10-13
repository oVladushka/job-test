const $root = document.getElementById('root');
const $form = document.querySelector('form');
const $file = document.getElementById('file');

$form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try{

        let form = new FormData();

        form.append('file', $file.files[0]);

        const user = await axios.post('/api/upload', form);

        console.log(user.data);

        $root.innerHTML = `<h1><a target="_blank" rel="noopener noreferrer" href="/img/${user.data.id}">${user.data.id}</a></h1>`;

    }catch(e){
        console.log(e.response ? e.response.data.error : e.message);
    }

});