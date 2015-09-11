# Internal branches

These brances are only for NLS internal use

#### NLS internal branches

* **master**
    * branch head is the latest release
    * no development work
    * commits are merged from **release** (and possibly **hotfix**) branches
    * tagged according to a calendar-based scheme

* **develop**
    * head is the work-in-progress next release
    * no direct development work
    * commits merged from **feature** branches

* **feature**
    * normal development happens here
    * usually one branch per task/feature/bug
    * generally local development, rarely pushed to a remote unless a collaborative effort is required
    * feature testing is done here, before merging (rebasing) back to **develop**

* **release**
    * testing, bugfixing and quality assurance
    * release testing is done here, before merging to **master** *and* **develop**

* **import**
    * adaptation and quality assurance of features/bugfixes implemented by external developers
    * essentially **feature** branches seeded by external commits

* **hotfix** (omitted from diagram)
    * fixes for blocker issues discovered after merging a **release** branch to **master**
    * branched from **master**, merged to **master** and **develop**
    * a symptom of insufficient release *testing*

#### Branches on Github

