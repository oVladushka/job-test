const $root = document.getElementById('root');

document.addEventListener('DOMContentLoaded', async () => {
    try{
        const pics = await axios.get('/api/last-post');

        const toRender = pics.data.data.map((item) => {
            return `<tr>
                        <td>${item.date}</td>
                        <td><a target="_blank" rel="noopener noreferrer" href="/img/${item.id}">${item.id}</a></td>
                    </tr>`
        });

        $root.innerHTML = `
        <table>
            <thead>
            <tr>
                <th>date</th>
                <th>id</th>
            </tr>
            </thead>
            <tbody>
                ${toRender.join(' ')}
            </tbody>
        </table>`;

        console.log(pics.data);
    }catch(e){
        console.log(e.response ? e.response.data.error : e.message);
    }
});