document.addEventListener("DOMContentLoaded", () => {
    let results = [];
    let selected = [];
    let current = [];
    let start = 1;
    const price = document.getElementById("price");
    const date = document.getElementById("date");
    const input = document.getElementById("input");
    const searchBtn = document.getElementById("search");
    const pages = document.getElementById("pages");
    const clear = document.getElementById("clear");
    const URL = "https://data.taipei/api/v1/dataset/f4f80730-df59-44f9-bfb8-32c136b1ae68?scope=resourceAquire";

    const search = (val, results) => {
        if (val === "") {
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
            createOptions(selected);
            renderTable(selected, 1, 20);
        } else {
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
        renderTable(arrToSort, start, start + 19);
    };
    
    const getData = async () => {
        const response = await fetch(URL).catch(async () => {
            await fetch("http://localhost:3000/api/veges");
        });

        const data = await response.json();
        let rawData = data.result.results;
        for (vege of rawData) {
            let trimmed = JSON.parse(
                JSON.stringify(vege).replace(/"\s+|\s+"/g, '"')
            );
            results.push(trimmed);
        }
        
        createOptions(results);
    }

    const createOptions = collection => {
        pages.innerHTML = "";
        for (let i = 1; i <= collection.length; i += 20) {
            let j = Math.min(i + 19, collection.length);
            pages.innerHTML += `
                <option>${i} - ${j}</option>
            `;
        }
    }

    const renderTable = (collection, start, end) => {
        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = "";
        current = [];
        for (let i = start - 1; i < end; i++) {
            const row = collection[i];
            current.push(row);
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
        }
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

    pages.addEventListener("change", e => {
        e.preventDefault();
        start = parseInt(e.target.value);
        if (selected.length) renderTable(selected, start, start + 19);
        else renderTable(results, start, start + 19);
    });

    clear.addEventListener("click", e => {
        e.preventDefault();
        input.value = "";
        selected = [];
        renderTable(results, 1, 20);
    })
    
    getData().then(() => {
        renderTable(results, start, start + 19);
    })
})
