// GenerateButton className to help with generating buttons for a choice in html
// Can generate and return button(s)

export { GenerateButton }

class GenerateButton{
    constructor(className='generic__button', id='generic__button', type = 'button', enabled = true, internalText='generic button'){
        this.className = className;
        this.id = id;
        this.type = type;
        this.enabled = enabled;
        this.internalText = internalText;
        this.currentButton = this.#generateHTMLButton();
    }

    // is the button enabled?
    #isButtonEnabled(){
        if(!this.enabled){
            return 'disabled';
        }
        return '';
    }

    // generate the set html button
    #generateHTMLButton(){
        let finalizedButton = '<button' + 
                              ' className=' + this.className + 
                              ' id=' + this.id + 
                              ' type=' + this.type + 
                              ' ' + this.#isButtonEnabled() +
                              '>' + this.internalText + 
                              '</button>';
        return finalizedButton;
    }

    // set html button properties when wanting to generate a html button
    setHTMLButtonProperties(className, id, type, enabled, buttoninternals){
        this.className = className;
        this.id = id;
        this.type = type;
        this.enabled = enabled;
        this.internalText = buttoninternals;
        this.currentButton = this.#generateHTMLButton();
    }

    // get the currently made html button
    getHTMLButton(){
        return this.currentButton;
    }

}