{pkgs}: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
    pkgs.corepack
  ];
  idx.extensions = [
    "svelte.svelte-vscode"
    "vue.volar"
    "bradlc.vscode-tailwindcss"
    "christian-kohler.npm-intellisense"
    "dbaeumer.vscode-eslint"
    "esbenp.prettier-vscode"
    "Orta.vscode-twoslash-queries"
    "stylelint.vscode-stylelint"
    "vitest.explorer"
    "xabikos.JavaScriptSnippets"
    "YoavBls.pretty-ts-errors"
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "pnpm"
          "dev"
          "--port"
          "9000"
        ];
        manager = "web";
      };
    };
  };
}