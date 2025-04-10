
const choices=document.getElementById('choices');
const wrongAns=document.querySelector('.incorrect');
const rightAns=document.querySelector('.correct');
const allChoices=choices.querySelectorAll('button');

choices.addEventListener('click',(e)=>{ 

    if(e.target.tagName=='BUTTON'){ 
        const selected_choice=e.target;
    
        if(rightAns.contains(selected_choice)){ 
            selected_choice.style.backgroundColor='green';
        }

        else if(wrongAns.contains(selected_choice)){
            selected_choice.style.backgroundColor='red';
        }  

        allChoices.forEach(button=>{ 
            if(button!=selected_choice){ 
                button.disabled=true;
            }
        })

    }

});  

    