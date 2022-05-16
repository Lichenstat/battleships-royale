// CreateButton className to help with generating buttons for a choice in html
// Can create and return button(s)

export { CreateButton }

class CreateButton{

    #className;
    #id;
    #type;
    #enabled;
    #internalText;
    #currentButton;

    constructor(className='generic__button', id='generic__button', type = 'button', enabled = true, internalText='generic button'){
        this.#className = className;
        this.#id = id;
        this.#type = type;
        this.#enabled = enabled;
        this.#internalText = internalText;
        this.#currentButton = this.#createHTMLButton();
    }

    // is the button enabled?
    #isButtonEnabled(){
        if(!this.#enabled){
            return 'disabled';
        }
        return '';
    }

    // create the set html button
    #createHTMLButton(){
        let finalizedButton = '<button' + 
                              ' className=\"' + this.#className + '\"' + 
                              ' id=\"' + this.#id + '\"' + 
                              ' type=\"' + this.#type + '\"' + 
                              ' ' + this.#isButtonEnabled() +
                              '>' + this.#internalText + 
                              '</button>';
        return finalizedButton;
    }

    // set html button properties when wanting to create a html button
    setHTMLButtonProperties(className, id, type, enabled, buttoninternals){
        this.#className = className;
        this.#id = id;
        this.#type = type;
        this.#enabled = enabled;
        this.#internalText = buttoninternals;
        this.#currentButton = this.#createHTMLButton();
    }

    // get the currently made html button
    getHTMLButton(){
        return this.#currentButton;
    }

}