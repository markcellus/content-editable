import '../src/editable-content';
import '../node_modules/chai/chai.js';
const { assert } = chai;

describe('Editable Content', () => {
    it('should render inner content', () => {
        const tpl = document.createElement('template');
        tpl.innerHTML = `
            <editable-content>Test</editable-content>
        `;
        const component = tpl.content.querySelector('editable-content');
        document.body.appendChild(tpl.content);
        assert.equal(component.innerHTML, 'Test');
        component.remove();
    });
});
