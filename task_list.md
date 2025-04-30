## React Hook Migration Task List

This task list outlines the process for migrating React hooks from the `./new` folder to the `./src` folder, ensuring quality and efficiency.

- [ ] **Preparation (One-Time Setup)**
  - [ ] Review all files in the `./new` folder for potential copyright issues and note them.
  - [ ] Identify and list any external libraries required by the hooks in `./new`.
  - [ ] Ensure `npm run build` runs without error before starting the hook migration.
- [ ] **Hook Migration (Repeat for Each Hook)**
  - [ ] **Select Hook:** Choose one hook from the `./new` folder.
  - [ ] **Duplicate Check**: Check if the hook already exist in the `src/hooks` folder. If it exists, delete the hook from the `./new` folder and skip to the next hook. Otherwise, proceed with the migration.
  - [ ] **Copyright Check:** Review any copyright issues that may be present in the hook being migrated. If copyright or licensing is problematic, the hook should be discarded.
  - [ ] **Import Review:** Examine the hook's code to identify all imported code from other files.
  - [ ] **Code Consolidation:** Merge all imported code into the hook's primary file within the `./new` directory.
   - [ ] **File Creation:** Create a new file for the hook in the `./src/hooks` folder. Name the file `use[HookName].ts` (e.g., `useMyHook.ts`).
   - [ ] **Code Transfer:** Copy the consolidated code into the new file.
  - [ ] **Build Check:** Run `npm run build` to check for type errors and code issues. If build fails fix the hook, and run again.
  - [ ] **Index Update:** Add an export statement for the new hook in `src/index.ts`. (exsample  export {default as useDeviceMotion} from "./hooks/useDeviceMotion";)
  