document.addEventListener("DOMContentLoaded", () => {
    let results = [];
    const price = document.getElementById("price");
    const date = document.getElementById("date");

    const handleSort = (dataset) => {
        if (dataset.col === "price") {
            if (dataset.order === "asc") {
                price.dataset.order = "desc";
                results = results.sort(
                    (a, b) => b[" 平均(元 / 公斤)"] - a[" 平均(元 / 公斤)"]
                );
            } else {
                price.dataset.order = "asc";
                results = results.sort(
                    (a, b) => a[" 平均(元 / 公斤)"] - b[" 平均(元 / 公斤)"]
                );
            }
        } else {
            if (dataset.order === "asc") {
                date.dataset.order = "desc";
                results = results.sort(
                    (a, b) => new Date(b["日期"]) - new Date(a["日期"])
                );
            } else {
                date.dataset.order = "asc";
                results = results.sort(
                    (a, b) => new Date(a["日期"]) - new Date(b["日期"])
                );
            }
        }
        renderTable(results);
    };

    price.addEventListener("click", (e) => {
        e.preventDefault();
        handleSort(price.dataset);
    })
    
    date.addEventListener("click", (e) => {
        e.preventDefault();
        handleSort(date.dataset);
    })
    
    const getData = async () => {
        const response = await fetch(
            "https://data.taipei/api/v1/dataset/f4f80730-df59-44f9-bfb8-32c136b1ae68?scope=resourceAquire"
        );
        const data = await response.json();
        results = data.result.results.slice(0, 50);
    }

    const renderTable = (results) => {
        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = "";
        // console.log(results);
        results.forEach((row) => {
            let rowToRender = `
                <tr>
                    <td>${row[" 品名"]}</td>
                    <td>${row[" 市場"]}</td>
                    <td>${row[" 平均(元 / 公斤)"]}</td>
                    <td>${row[" 種類"]}</td>
                    <td>${row["日期"]}</td>
                </tr>
            `;
            tableBody.innerHTML += rowToRender;
        })
    }
    
    getData().then(() => {
        renderTable(results);
    })
})
