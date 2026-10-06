
import { FileText } from 'lucide-react'
import React from 'react'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '../../ui/navigation-menu'
import { Link } from 'react-router-dom'
import { Button } from '../../ui/button'

const HomeHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <span>FileFlow</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
                <NavigationMenuItem>
                
                <NavigationMenuLink
                  render={<a href="#upload">Upload</a>}
                  className={navigationMenuTriggerStyle()}
                />
              </NavigationMenuItem>
                <NavigationMenuItem>
                
                <NavigationMenuLink
                  render={<a href="#file-retrieval">Get file</a>}
                  className={navigationMenuTriggerStyle()}
                />
              </NavigationMenuItem>
              <NavigationMenuItem>
                
                <NavigationMenuLink
                  render={<a href="#features">Features</a>}
                  className={navigationMenuTriggerStyle()}
                />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<a href="#how">How it works</a>}
                  className={navigationMenuTriggerStyle()}
                />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<a href="#pricing">Pricing</a>}
                  className={navigationMenuTriggerStyle()}
                />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm">
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>
  )
}

export default HomeHeader