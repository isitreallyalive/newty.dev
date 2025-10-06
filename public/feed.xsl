<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet
  version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width" />
        <title>newty.dev</title>

        <!-- styling -->
        <script
          src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"
        ></script>
        <!-- fonts -->
    <link
      href="https://api.fonts.coollabs.io/css2?family=Cascadia+Code&amp;family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&amp;display=swap"
      rel="stylesheet"
    />
        <style type="text/tailwindcss">
          @theme inline {
            --font-sans: "Outfit", sans-serif;
            --font-mono: "Cascadia Code", monospace;
            --color-background: #181825; /* mantle */
            --color-foreground: #cdd6f4; /* text */
            --color-muted-foreground: #a6adc8; /* subtext0 */
            --color-accent: #cba6f7; /* mauve */
            --color-lavender: #b4befe;
          }

          ::selection {
            background-color: var(--color-accent);
            color: var(--color-background);
          }

          h1, i {
            @apply font-mono text-2xl font-semibold sm:text-3xl;
          }

          p {
            @apply mb-2;
          }
        </style>
      </head>
      <body
        class="bg-background text-foreground flex min-h-screen flex-col sm:text-lg"
      >
        <div
          class="mx-auto my-8 flex max-w-xs flex-col lg:max-w-3xl xl:max-w-5xl"
        >
          <!-- src/components/nav/Nav.astro -->
          <nav class="flex items-center justify-between select-none">
            <div class="flex items-center gap-4 font-mono text-xl">
              <!-- src/components/nav/Cat.astro -->
              <button
                class="relative font-mono text-sm font-bold -tracking-[0.125em] transition-colors select-none hover:cursor-pointer hover:brightness-125 sm:text-base"
              >
                <div>/\_/\</div>
                <div>
                  ( o.o )
                </div>
                <div>&gt; ^ &lt;</div>
              </button>

              <a href="/" class="hover:text-accent font-semibold">newt</a>
            </div>
          </nav>
          <main>
            <div
              class="border-accent 2shadow-lg 2bg-ctp-base/40 mt-8 mb-10 flex w-full flex-col rounded-xl border p-4 sm:p-6"
            >
              <div class="flex gap-1 items-center">
                <xsl:for-each select="document('rss.svg')/*">
                  <xsl:copy>
                    <xsl:copy-of select="@*"/>
                    <xsl:attribute name="class">fill-current h-9 text-foreground</xsl:attribute>
                    <xsl:copy-of select="node()"/>
                  </xsl:copy>
                </xsl:for-each>
                <h1>This is an RSS feed</h1>
              </div>

              <p>
                To subscribe to this feed, add this URL to your RSS reader:
                <code><xsl:value-of select="/rss/channel/link" />rss.xml</code>
              </p>
            </div>

            <!-- posts -->
            <xsl:for-each select="/rss/channel/item">
              <a class="flex items-center gap-8 group max-w-fit">
                <xsl:attribute name="href">
                  <xsl:value-of select="link" />
                </xsl:attribute>
                <!-- date -->
                <span class="text-muted-foreground font-mono flex-none w-auto whitespace-nowrap">
                  <xsl:value-of select="substring(pubDateISO, 1, 4)" /> · <xsl:value-of select="substring(pubDateISO, 6, 2)" />  · <xsl:value-of select="substring(pubDateISO, 9, 2)" />
                </span>
                <!-- title -->
                <h1 class="group-hover:text-accent"><xsl:value-of select="title" /></h1>
              </a>
              <!-- description -->
              <p><xsl:value-of select="description" /></p>
              <!-- divider -->
              <xsl:if test="position() != last()">
                <hr class="border-foreground/50 my-6 rounded-full border-t-2" />
              </xsl:if>
            </xsl:for-each>
          </main>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>