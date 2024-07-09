const RightSidebar = ({user, transactions, banks}: RightSidebarProps) => {
  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">
        {/* NOTE: Apparantly, we can use this self-closing tag because we are using bg-gradient-mesh(gradient-mesh is defined in tailwind.config.ts) and bg-gradient-mesh is resolved
        to background-image: url(/icons/gradient-mesh.svg); so it will render an image so we don't need to have any content inside the div. */}
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img">
            {/* NOTE: "user.firstName[0]" signifies the first character of the user's name */}
            <span className="text-5xl font-bold text-blue-500">{user.firstName[0]}</span>
          </div>
        </div>
      </section>
    </aside>
  )
}

export default RightSidebar