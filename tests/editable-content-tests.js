import '../src/editable-content';
import '../node_modules/chai/chai.js';
import sinon from '../node_modules/sinon/pkg/sinon-esm.js';

const { expect } = chai;

describe('Editable Content', () => {
    it('should render inner content', () => {
        const tpl = document.createElement('template');
        tpl.innerHTML = `
            <editable-content>Test</editable-content>
        `;
        const component = tpl.content.querySelector('editable-content');
        document.body.appendChild(tpl.content);
        expect(component.innerHTML).to.equal('Test');
        component.remove();
    });

    it('should not set editing attribute when focusing into and remove when focus is lost', () => {
        const tpl = document.createElement('template');
        tpl.innerHTML = `
            <editable-content>Test</editable-content>
        `;
        const component = tpl.content.querySelector('editable-content');
        document.body.appendChild(tpl.content);
        component.focus();
        expect(component.hasAttribute('editing')).equal(true);
        component.blur();
        expect(component.hasAttribute('editing')).equal(false);
        component.remove();
    });

    it('should fire event with new and old value when blurring the component after changing its value', () => {
        const tpl = document.createElement('template');
        const previousTextContent = 'Test';
        tpl.innerHTML = `
            <editable-content>${previousTextContent}</editable-content>
        `;
        const component = tpl.content.querySelector('editable-content');
        document.body.appendChild(tpl.content);
        const editSpy = sinon.spy();
        component.addEventListener('edit', editSpy);
        component.focus();
        const textContent = 'New Value';
        component.textContent = textContent;
        component.blur();
        expect(editSpy.callCount).to.equal(1);
        const evt = editSpy.args[0][0];
        expect(evt.detail).to.deep.equal({ textContent, previousTextContent });
        component.remove();
    });

    it('should fire edit event with new and old value when pressing enter key', () => {
        const tpl = document.createElement('template');
        const previousTextContent = 'Test';
        tpl.innerHTML = `
            <editable-content>${previousTextContent}</editable-content>
        `;
        const component = tpl.content.querySelector('editable-content');
        document.body.appendChild(tpl.content);
        const editSpy = sinon.spy();
        component.addEventListener('edit', editSpy);
        component.focus();
        const textContent = 'New Value';
        component.textContent = textContent;
        const keypressEvent = new KeyboardEvent('keypress', {key: 'Enter'});
        component.dispatchEvent(keypressEvent);
        expect(editSpy.callCount).to.equal(1);
        const evt = editSpy.args[0][0];
        expect(evt.detail).to.deep.equal({ textContent, previousTextContent });
        component.remove();
    });

    it('should not allow editing if has readonly attribute', () => {
        const tpl = document.createElement('template');
        tpl.innerHTML = `
            <editable-content readonly>Test</editable-content>
        `;
        const component = tpl.content.querySelector('editable-content');
        document.body.appendChild(tpl.content);
        component.focus();
        expect(component.contentEditable).to.equal('false');
        component.remove();
    });
});
