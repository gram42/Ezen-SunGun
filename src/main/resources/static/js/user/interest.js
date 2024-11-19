(()=>{
    document.querySelectorAll('.user-selected-interests').forEach((user_interest)=>{
        document.querySelectorAll('.interests-list').forEach((interest)=>{
            if (interest.value === user_interest.value){
                interest.checked = true;
            }
        })
    })
})();