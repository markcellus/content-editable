import * as chai from 'chai';
import * as sinon from 'sinon';
import '../src/editable-content';

const { expect } = chai;

describe('Editable Content', () => {
    it('should render inner content', () => {
        const component = document.createElement('editable-content');
        component.innerHTML = 'Test';
        document.body.appendChild(component);
        expect(component.textContent).to.equal('Test');
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

    it('should not allow editing if has readonly attribute', () => {
        const component = document.createElement('editable-content');
        component.setAttribute('readonly', '');
        component.innerHTML = 'Test';
        document.body.appendChild(component);
        component.focus();
        expect(component.contentEditable).to.equal('false');
        component.remove();
    });

    describe('when parsing html', () => {
        it('should parse paragraph tags', () => {
            const text = 'Paragraph Text';
            const component = document.createElement('editable-content');
            component.innerHTML = `<p>${text}</p>`;
            document.body.appendChild(component);
            expect(component.children.length).to.equal(1);
            const [child] = Array.from(component.children);
            expect(child.innerHTML).to.equal(text);
            component.remove();
        });

        it('should convert links to anchors if readonly is set to true', () => {
            const url = 'http://test.com/';
            const content = `My link is ${url}`;
            const component = document.createElement('editable-content');
            component.setAttribute('readonly', '');
            component.innerHTML = content;
            document.body.appendChild(component);
            const anchors = component.querySelectorAll('a');
            expect(anchors.length).to.equal(1);
            const [anchor] = Array.from(anchors);
            expect(anchor.href).to.equal(url);
            component.remove();
        });

        it('should NOT convert links to anchors if readonly is not set', () => {
            const content = `My link is http://test.com/`;
            const component = document.createElement('editable-content');
            component.innerHTML = content;
            document.body.appendChild(component);
            const anchors = component.querySelectorAll('a');
            expect(anchors.length).to.equal(0);
            expect(component.innerText).to.equal(content);
            component.remove();
        });
    });
});
