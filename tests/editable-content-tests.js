import '../src/editable-content';
import '../node_modules/chai/chai.js';
import sinon from '../node_modules/sinon/pkg/sinon-esm.js';

const { expect } = chai;

describe('Editable Content', () => {
    it('should render inner content', () => {
        const component = document.createElement('editable-content');
        component.innerHTML = 'Test';
        document.body.appendChild(component);
        expect(component.textContent.trim()).to.equal('Test');
        component.remove();
    });

    it('should not set editing attribute when focusing into and remove when focus is lost', () => {
        const component = document.createElement('editable-content');
        component.innerHTML = 'Test';
        document.body.appendChild(component);
        component.focus();
        expect(component.hasAttribute('editing')).equal(true);
        component.blur();
        expect(component.hasAttribute('editing')).equal(false);
        component.remove();
    });

    it('should fire event with new and old value when blurring the component after changing its value', () => {
        const previousTextContent = 'Test';
        const component = document.createElement('editable-content');
        component.innerHTML = previousTextContent;
        document.body.appendChild(component);
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
        const previousTextContent = 'Test';
        const component = document.createElement('editable-content');
        component.innerHTML = previousTextContent;
        document.body.appendChild(component);
        const editSpy = sinon.spy();
        component.addEventListener('edit', editSpy);
        component.focus();
        const textContent = 'New Value';
        component.textContent = textContent;
        const keypressEvent = new KeyboardEvent('keypress', { key: 'Enter' });
        component.dispatchEvent(keypressEvent);
        expect(editSpy.callCount).to.equal(1);
        const evt = editSpy.args[0][0];
        expect(evt.detail).to.deep.equal({ textContent, previousTextContent });
        component.remove();
    });

    it('should not allow editing if has readonly attribute', () => {
        const component = document.createElement('editable-content');
        component.setAttribute('readonly', '');
        component.innerHTML = 'Test';
        document.body.appendChild(component);
        component.focus();
        expect(component.contentEditable).to.equal('false');
        component.remove();
    });

    it('should NOT fire edit event with new and old value when pressing enter key or blurring after changing if readonly is set', () => {
        const previousTextContent = 'Test';
        const component = document.createElement('editable-content');
        component.setAttribute('readonly', '');
        component.innerHTML = previousTextContent;
        document.body.appendChild(component);
        const editSpy = sinon.spy();
        component.addEventListener('edit', editSpy);
        component.focus();
        expect(editSpy.callCount).to.equal(0);
        const keypressEvent = new KeyboardEvent('keypress', { key: 'Enter' });
        component.dispatchEvent(keypressEvent);
        expect(editSpy.callCount).to.equal(0);
        component.remove();
    });

    describe('when parsing html', function() {

        it('should parse paragraph tags', () => {
            const text = 'Paragraph Text';
            const component = document.createElement('editable-content');
            component.innerHTML = `<p>${text}</p>`;
            document.body.appendChild(component);
            expect(component.children.length).to.equal(1);
            const [child] = component.children;
            expect(child.innerHTML).to.equal(text);
            component.remove();
        });

        it('should convert links to anchors if readonly is set to true', () => {
            const url = 'http://test.com';
            const content = `My link is ${url}`;
            const component = document.createElement('editable-content');
            component.setAttribute('readonly', '');
            component.innerHTML = content;
            document.body.appendChild(component);
            const anchors = component.querySelectorAll('a');
            expect(anchors.length).to.equal(1);
            const [anchor] = anchors;
            expect(anchor.href).to.equal(url);
            component.remove();
        });

        it('should NOT convert links to anchors if readonly is not set', () => {
            const content = `My link is http://test.com`;
            const component = document.createElement('editable-content');
            component.innerHTML = content;
            document.body.appendChild(component);
            const anchors = component.querySelectorAll('a');
            expect(anchors.length).to.equal(0);
            const [anchor] = anchors;
            expect(component.innerText).to.equal(content);
            component.remove();
        });
    });
});
