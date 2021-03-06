const url = "https://cachimbogo-flask.herokuapp.com";

export default function PostData(dir, data,flag) {
    let urlTemp;
    return new Promise((resolve, reject) => {
        if(flag){
            urlTemp=url;
        }else{
            urlTemp=url;
        }
       // console.log(`${urlTemp}/${dir}`);
       // console.log(data);
        fetch(`${urlTemp}/${dir}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                resolve(res)
            })
            .catch((error) => {
                reject(error);
            });
    })
}