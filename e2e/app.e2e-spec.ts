import { ProjectSos3Page } from './app.po';

describe('project-sos3 App', function() {
  let page: ProjectSos3Page;

  beforeEach(() => {
    page = new ProjectSos3Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
