document.addEventListener("DOMContentLoaded", () => {
    let results = [];
    let selected = [];
    const price = document.getElementById("price");
    const date = document.getElementById("date");
    const input = document.getElementById("input");
    const searchBtn = document.getElementById("search");

    const search = (val, results) => {
        if (val === "") {
            renderTable(results);
            alert("沒有你要找的菜ㄟ歹勢");
            return;
        }
        selected = [];
        for (let i = 0; i < results.length; i++) {
            const name = results[i]["品名"];
            const market = results[i]["市場"];
            if (name.includes(val) || market.includes(val)) selected.push(results[i]);
        }
        
        if (selected.length) {
            renderTable(selected);
        } else {
            renderTable(results);
            alert("沒有你要找的菜ㄟ歹勢");
        }
    }

    const handleSort = (dataset) => {
        let arrToSort;
        selected.length ? arrToSort = selected : arrToSort = results;
        if (dataset.col === "price") {
            if (dataset.order === "asc") {
                price.dataset.order = "desc";
                arrToSort = arrToSort.sort(
                    (a, b) => b["平均(元 / 公斤)"] - a["平均(元 / 公斤)"]
                );
            } else {
                price.dataset.order = "asc";
                arrToSort = arrToSort.sort(
                    (a, b) => a["平均(元 / 公斤)"] - b["平均(元 / 公斤)"]
                );
            }
        } else {
            if (dataset.order === "asc") {
                date.dataset.order = "desc";
                arrToSort = arrToSort.sort(
                    (a, b) => new Date(b["日期"]) - new Date(a["日期"])
                );
            } else {
                date.dataset.order = "asc";
                arrToSort = arrToSort.sort(
                    (a, b) => new Date(a["日期"]) - new Date(b["日期"])
                );
            }
        }
        renderTable(arrToSort);
    };
    
    const getData = async () => {
        const response = await fetch(
            "https://data.taipei/api/v1/dataset/f4f80730-df59-44f9-bfb8-32c136b1ae68?scope=resourceAquire&limit=10"
        );
        const data = await response.json();
        let rawData = data.result.results;
        for (vege of rawData) {
            let trimmed = JSON.parse(
                JSON.stringify(vege).replace(/"\s+|\s+"/g, '"')
            );
            results.push(trimmed);
        }
        console.log(results);
    }

    const renderTable = (results) => {
        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = "";
        results.forEach((row) => {
            let rowToRender = `
                <tr>
                    <td>${row["品名"]}</td>
                    <td>${row["市場"]}</td>
                    <td>${row["平均(元 / 公斤)"]}</td>
                    <td>${row["種類"]}</td>
                    <td>${row["日期"]}</td>
                </tr>
            `;
            tableBody.innerHTML += rowToRender;
        })
    }

    price.addEventListener("click", (e) => {
        e.preventDefault();
        handleSort(price.dataset);
    });

    date.addEventListener("click", (e) => {
        e.preventDefault();
        handleSort(date.dataset);
    });

    searchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        search(input.value, results);
    })

    input.addEventListener("keyup", e => {
        e.preventDefault();
        if (e.keyCode === 13) searchBtn.click();
    })
    
    getData().then(() => {
        renderTable(results);
    })
})
