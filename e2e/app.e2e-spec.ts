import { TokbirdClientPage } from './app.po';

describe('tokbird-client App', () => {
  let page: TokbirdClientPage;

  beforeEach(() => {
    page = new TokbirdClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
