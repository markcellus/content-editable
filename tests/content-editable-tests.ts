import { expect, fixture, html } from '@open-wc/testing';
import '../src/content-editable';
import { ContentEditable } from '../src/content-editable';

describe('Content Editable', () => {
    it('renders inner content', async () => {
        const component = await fixture(html`
            <content-editable>Test</content-editable>
        `);
        expect(component.textContent).to.equal('Test');
    });

    it('does NOT set editing attribute when focusing into and remove when focus is lost', async () => {
        const component = await fixture<ContentEditable>(html`
            <content-editable>Test</content-editable>
        `);
        component.focus();
        expect(component.hasAttribute('editing')).to.equal(true);
        component.blur();
        expect(component.hasAttribute('editing')).to.equal(false);
    });

    it('sets contentEditable propery to false if has readonly attribute', async () => {
        const component = await fixture<ContentEditable>(html`
            <content-editable readonly>Test</content-editable>
        `);
        component.focus();
        expect(component.contentEditable).to.equal('false');
    });

    describe('when parsing html', () => {
        it('parses paragraph tags', async () => {
            const text = 'Paragraph Text';
            const component = await fixture<ContentEditable>(html`
                <content-editable><p>${text}</p></content-editable>
            `);
            expect(component.children.length).to.equal(1);
            const [p] = Array.from(component.children);
            expect(p.textContent).to.equal(text);
        });

        it('converts links to anchors if readonly is set to true', async () => {
            const url = 'http://test.com/';
            const content = `My link is ${url}`;
            const component = await fixture<ContentEditable>(html`
                <content-editable readonly>${content}</content-editable>
            `);
            const anchors = component.querySelectorAll('a');
            expect(anchors.length).to.equal(1);
            const [anchor] = Array.from(anchors);
            expect(anchor.href).to.equal(url);
        });

        it('does NOT convert links to anchors if readonly is not set', async () => {
            const content = `My link is http://test.com/`;
            const component = await fixture<ContentEditable>(html`
                <content-editable><p>${content}</p></content-editable>
            `);
            const anchors = component.querySelectorAll('a');
            expect(anchors.length).to.equal(0);
            expect(component.innerText).to.equal(content);
        });
    });
});
