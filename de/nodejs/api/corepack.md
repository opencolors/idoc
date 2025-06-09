---
title: Node.js Corepack Dokumentation
description: Corepack ist ein Binärdatei, die mit Node.js ausgeliefert wird und eine Standard-Schnittstelle zum Verwalten von Paketmanagern wie npm, pnpm und Yarn bietet. Es ermöglicht Benutzern, einfach zwischen verschiedenen Paketmanagern und Versionen zu wechseln, um die Kompatibilität zu gewährleisten und den Entwicklungsprozess zu vereinfachen.
head:
  - - meta
    - name: og:title
      content: Node.js Corepack Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Corepack ist ein Binärdatei, die mit Node.js ausgeliefert wird und eine Standard-Schnittstelle zum Verwalten von Paketmanagern wie npm, pnpm und Yarn bietet. Es ermöglicht Benutzern, einfach zwischen verschiedenen Paketmanagern und Versionen zu wechseln, um die Kompatibilität zu gewährleisten und den Entwicklungsprozess zu vereinfachen.
  - - meta
    - name: twitter:title
      content: Node.js Corepack Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Corepack ist ein Binärdatei, die mit Node.js ausgeliefert wird und eine Standard-Schnittstelle zum Verwalten von Paketmanagern wie npm, pnpm und Yarn bietet. Es ermöglicht Benutzern, einfach zwischen verschiedenen Paketmanagern und Versionen zu wechseln, um die Kompatibilität zu gewährleisten und den Entwicklungsprozess zu vereinfachen.
---


# Corepack {#corepack}

**Hinzugefügt in: v16.9.0, v14.19.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

*<a href="https://github.com/nodejs/corepack">Corepack</a>* ist ein experimentelles Tool, das bei der Verwaltung von Versionen Ihrer Paketmanager hilft. Es stellt binäre Proxys für jeden [unterstützten Paketmanager](/de/nodejs/api/corepack#supported-package-managers) bereit, die, wenn sie aufgerufen werden, ermitteln, welcher Paketmanager für das aktuelle Projekt konfiguriert ist, ihn bei Bedarf herunterladen und schließlich ausführen.

Obwohl Corepack mit Standardinstallationen von Node.js ausgeliefert wird, sind die von Corepack verwalteten Paketmanager nicht Teil der Node.js-Distribution und:

- Bei der ersten Verwendung lädt Corepack die neueste Version aus dem Netzwerk herunter.
- Alle erforderlichen Updates (im Zusammenhang mit Sicherheitslücken oder anderweitig) fallen nicht in den Zuständigkeitsbereich des Node.js-Projekts. Bei Bedarf müssen die Endbenutzer selbst herausfinden, wie sie die Updates durchführen.

Diese Funktion vereinfacht zwei Kern-Workflows:

- Sie erleichtert das Onboarding neuer Mitwirkender, da diese keine systemspezifischen Installationsprozesse mehr durchlaufen müssen, nur um den von Ihnen gewünschten Paketmanager zu haben.
- Es ermöglicht Ihnen sicherzustellen, dass jeder in Ihrem Team genau die Paketmanager-Version verwendet, die Sie für ihn vorgesehen haben, ohne dass er diese jedes Mal manuell synchronisieren muss, wenn Sie ein Update durchführen müssen.

## Workflows {#workflows}

### Aktivieren der Funktion {#enabling-the-feature}

Aufgrund seines experimentellen Status muss Corepack derzeit explizit aktiviert werden, um eine Wirkung zu erzielen. Führen Sie dazu [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name) aus. Dadurch werden die Symlinks in Ihrer Umgebung neben der `node`-Binärdatei eingerichtet (und die vorhandenen Symlinks bei Bedarf überschrieben).

Ab diesem Zeitpunkt funktioniert jeder Aufruf der [unterstützten Binärdateien](/de/nodejs/api/corepack#supported-package-managers) ohne weitere Einrichtung. Sollten Sie ein Problem feststellen, führen Sie [`corepack disable`](https://github.com/nodejs/corepack#corepack-disable--name) aus, um die Proxys von Ihrem System zu entfernen (und erwägen Sie, ein Problem im [Corepack-Repository](https://github.com/nodejs/corepack) zu eröffnen, um uns dies mitzuteilen).


### Konfigurieren eines Pakets {#configuring-a-package}

Die Corepack-Proxys finden die nächste [`package.json`](/de/nodejs/api/packages#nodejs-packagejson-field-definitions)-Datei in Ihrer aktuellen Verzeichnishierarchie, um deren [`"packageManager"`](/de/nodejs/api/packages#packagemanager)-Eigenschaft zu extrahieren.

Wenn der Wert einem [unterstützten Paketmanager](/de/nodejs/api/corepack#supported-package-managers) entspricht, stellt Corepack sicher, dass alle Aufrufe der relevanten Binärdateien gegen die angeforderte Version ausgeführt werden, lädt sie bei Bedarf herunter und bricht ab, wenn sie nicht erfolgreich abgerufen werden kann.

Sie können [`corepack use`](https://github.com/nodejs/corepack#corepack-use-nameversion) verwenden, um Corepack aufzufordern, Ihre lokale `package.json` zu aktualisieren, um den Paketmanager Ihrer Wahl zu verwenden:

```bash [BASH]
corepack use  # setzt die neueste 7.x-Version in der package.json
corepack use yarn@* # setzt die neueste Version in der package.json
```
### Aktualisieren der globalen Versionen {#upgrading-the-global-versions}

Wenn außerhalb eines bestehenden Projekts ausgeführt (z. B. beim Ausführen von `yarn init`), verwendet Corepack standardmäßig vordefinierte Versionen, die in etwa den neuesten stabilen Releases der einzelnen Tools entsprechen. Diese Versionen können überschrieben werden, indem Sie den Befehl [`corepack install`](https://github.com/nodejs/corepack#corepack-install--g--global---all--nameversion) zusammen mit der Paketmanager-Version ausführen, die Sie festlegen möchten:

```bash [BASH]
corepack install --global 
```
Alternativ kann ein Tag oder ein Bereich verwendet werden:

```bash [BASH]
corepack install --global pnpm@*
corepack install --global yarn@stable
```
### Offline-Workflow {#offline-workflow}

Viele Produktionsumgebungen haben keinen Netzwerkzugriff. Da Corepack die Paketmanager-Releases normalerweise direkt von ihren Registries herunterlädt, kann dies zu Konflikten mit solchen Umgebungen führen. Um dies zu vermeiden, rufen Sie den Befehl [`corepack pack`](https://github.com/nodejs/corepack#corepack-pack---all--nameversion) auf, solange Sie noch Netzwerkzugriff haben (typischerweise gleichzeitig mit der Vorbereitung Ihres Deployment-Images). Dadurch wird sichergestellt, dass die erforderlichen Paketmanager auch ohne Netzwerkzugriff verfügbar sind.

Der `pack`-Befehl hat [verschiedene Flags](https://github.com/nodejs/corepack#utility-commands). Weitere Informationen finden Sie in der detaillierten [Corepack-Dokumentation](https://github.com/nodejs/corepack#readme).


## Unterstützte Paketmanager {#supported-package-managers}

Die folgenden Binärdateien werden über Corepack bereitgestellt:

| Paketmanager | Binärnamen |
| --- | --- |
| [Yarn](https://yarnpkg.com/) | `yarn`  ,   `yarnpkg` |
| [pnpm](https://pnpm.io/) | `pnpm`  ,   `pnpx` |
## Häufige Fragen {#common-questions}

### Wie interagiert Corepack mit npm? {#how-does-corepack-interact-with-npm?}

Obwohl Corepack npm wie jeden anderen Paketmanager unterstützen könnte, sind seine Shims standardmäßig nicht aktiviert. Dies hat einige Konsequenzen:

-  Es ist immer möglich, einen `npm`-Befehl innerhalb eines Projekts auszuführen, das für die Verwendung mit einem anderen Paketmanager konfiguriert ist, da Corepack ihn nicht abfangen kann.
-  Während `npm` eine gültige Option in der [`"packageManager"`](/de/nodejs/api/packages#packagemanager)-Eigenschaft ist, führt das Fehlen eines Shims dazu, dass das globale npm verwendet wird.

### Das Ausführen von `npm install -g yarn` funktioniert nicht {#running-npm-install--g-yarn-doesnt-work}

npm verhindert versehentliches Überschreiben der Corepack-Binärdateien bei einer globalen Installation. Um dieses Problem zu vermeiden, sollten Sie eine der folgenden Optionen in Betracht ziehen:

-  Führen Sie diesen Befehl nicht aus. Corepack stellt die Paketmanager-Binärdateien ohnehin bereit und stellt sicher, dass die angeforderten Versionen immer verfügbar sind, sodass die explizite Installation der Paketmanager nicht erforderlich ist.
-  Fügen Sie das `--force`-Flag zu `npm install` hinzu. Dies weist npm an, dass das Überschreiben von Binärdateien in Ordnung ist, aber Sie löschen dabei die Corepack-Binärdateien. (Führen Sie [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name) aus, um sie wieder hinzuzufügen.)

