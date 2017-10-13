import { CulidoughPage } from './app.po';

describe('culidough App', () => {
  let page: CulidoughPage;

  beforeEach(() => {
    page = new CulidoughPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
