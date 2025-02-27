// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="page.html">Hugo&#39;s Blog</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><a href="overview.html"><strong aria-hidden="true">1.</strong> Overview</a></li><li class="chapter-item expanded "><a href="ml/ml.html"><strong aria-hidden="true">2.</strong> ML</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="ml/prj_ml.html"><strong aria-hidden="true">2.1.</strong> ML by Hand</a></li><li class="chapter-item expanded "><a href="ml/fomln.html"><strong aria-hidden="true">2.2.</strong> 《Foundations of Machine Learning》</a></li></ol></li><li class="chapter-item expanded "><a href="rust/rust.html"><strong aria-hidden="true">3.</strong> Rust Lang</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="rust/stl.html"><strong aria-hidden="true">3.1.</strong> stl.rust</a></li><li class="chapter-item expanded "><a href="rust/debug/debug.html"><strong aria-hidden="true">3.2.</strong> Debug日志</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="rust/debug/1.html"><strong aria-hidden="true">3.2.1.</strong> E0506</a></li><li class="chapter-item expanded "><a href="rust/debug/2.html"><strong aria-hidden="true">3.2.2.</strong> E0597</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="other/other.html"><strong aria-hidden="true">4.</strong> Other Topics</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="other/website_by_gatsby.html"><strong aria-hidden="true">4.1.</strong> 利用GatsBy框架制作网站（旧版已弃用）</a></li><li class="chapter-item expanded "><a href="other/markdown_snippets.html"><strong aria-hidden="true">4.2.</strong> Style snippets</a></li><li class="chapter-item expanded "><a href="other/literature_management.html"><strong aria-hidden="true">4.3.</strong> 如何利用Zotero工具集高效管理文献</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
